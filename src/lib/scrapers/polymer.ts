// Polymer price scraper - best-effort.
// Source: Plastemart daily market prices page.
// NOTE: This is fragile — Plastemart's HTML may change without notice.
// Admin can always override any price manually (manualOverride flag).
//
// If scraping fails or returns empty, we leave existing DB values intact.

export interface PolymerScrapeRow {
  matchKey: string;   // lowercased name to match DB rows (e.g. "pp raffia")
  price: number;      // ₹/kg
}

const PLASTEMART_URL = 'https://www.plastemart.com/upload/PriceTracker/PriceTracker.aspx';

// Map plastemart-style headings to our internal names (lowercased).
// Matches our simplified PP / HDPE / LLDPE benchmark rows.
const NAME_HINTS: Record<string, string> = {
  'pp raffia': 'pp',
  'pp inj': 'pp',
  'pp injection': 'pp',
  'hdpe blow': 'hdpe',
  'hdpe film': 'hdpe',
  'lldpe film': 'lldpe',
  'lldpe': 'lldpe',
};

export async function fetchPolymerPrices(): Promise<PolymerScrapeRow[]> {
  try {
    const res = await fetch(PLASTEMART_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 BoriwalaPriceBot' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const rows: PolymerScrapeRow[] = [];
    const lower = html.toLowerCase();

    for (const [hint, matchKey] of Object.entries(NAME_HINTS)) {
      const idx = lower.indexOf(hint);
      if (idx === -1) continue;
      // Look ahead 400 chars for the first reasonable price number
      const window = html.slice(idx, idx + 400);
      const m = window.match(/(\d{2,3}(?:\.\d{1,2})?)/g);
      if (!m) continue;
      const candidate = m.map(Number).find((n) => n >= 50 && n <= 250);
      if (candidate) rows.push({ matchKey, price: candidate });
    }
    return rows;
  } catch (e) {
    console.error('[scraper:polymer] failed', e);
    return [];
  }
}
