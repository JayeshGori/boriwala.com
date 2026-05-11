import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketPrice from '@/lib/models/MarketPrice';
import { fetchJutePrices } from '@/lib/scrapers/jute';
import { fetchPolymerPrices } from '@/lib/scrapers/polymer';

// Vercel Cron / external trigger endpoint.
// Protect with CRON_SECRET so only your cron caller can invoke it.
//   Header:  Authorization: Bearer <CRON_SECRET>
// Vercel cron automatically sends Authorization: Bearer <CRON_SECRET>
// if CRON_SECRET is configured in env.

function applyUpdate(existing: { price: number; previousPrice: number; trend: string; changePct: number }, newPrice: number) {
  if (!newPrice || newPrice === existing.price) return null;
  const diff = newPrice - existing.price;
  return {
    previousPrice: existing.price,
    price: newPrice,
    trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat',
    changePct: existing.price > 0 ? +((diff / existing.price) * 100).toFixed(2) : 0,
    lastUpdated: new Date(),
  };
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  await dbConnect();
  const all = await MarketPrice.find({ manualOverride: false });
  const report = { polymer: { fetched: 0, updated: 0 }, jute: { fetched: 0, updated: 0 } };

  // --- POLYMERS ---
  const polymerRows = await fetchPolymerPrices();
  report.polymer.fetched = polymerRows.length;
  for (const row of polymerRows) {
    const doc = all.find(
      (d) => d.category === 'polymer' && d.name.toLowerCase() === row.matchKey
    );
    if (!doc) continue;
    const upd = applyUpdate(doc, row.price);
    if (upd) {
      Object.assign(doc, upd);
      await doc.save();
      report.polymer.updated++;
    }
  }

  // --- JUTE ---
  // Updates only the generic "Jute" mandi row with the latest TD-5/TD-6 avg.
  // MSP rows (containing "MSP" in name) are never auto-updated — those are govt-set.
  const juteRows = await fetchJutePrices();
  report.jute.fetched = juteRows.length;
  if (juteRows.length > 0) {
    const prices = juteRows.map((r) => r.modalPriceQtl).filter((p) => p > 0);
    if (prices.length > 0) {
      const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      const mandiDoc = all.find(
        (d) => d.category === 'jute' && !d.name.toLowerCase().includes('msp')
      );
      if (mandiDoc) {
        const upd = applyUpdate(mandiDoc, avg);
        if (upd) {
          Object.assign(mandiDoc, upd);
          await mandiDoc.save();
          report.jute.updated++;
        }
      }
    }
  }

  return NextResponse.json({ success: true, report, timestamp: new Date().toISOString() });
}
