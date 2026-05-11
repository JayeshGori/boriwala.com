// Jute price scraper using data.gov.in open API (AGMARKNET feed).
// Setup: register at https://data.gov.in for a free API key,
// then set DATA_GOV_API_KEY in environment.
//
// Dataset: "Variety-wise Daily Market Prices Data of Commodity" (AGMARKNET)
// Resource id: 9ef84268-d588-465a-a308-a864a43d0070

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

export interface JuteScrapeRow {
  variety: string;     // TD-5, TD-6, Mesta etc.
  modalPriceQtl: number;
  market?: string;
  state?: string;
  arrivalDate?: string;
}

export async function fetchJutePrices(): Promise<JuteScrapeRow[]> {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    console.warn('[scraper:jute] DATA_GOV_API_KEY missing - skipping');
    return [];
  }
  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&limit=50&filters[commodity]=Jute`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const records: Array<Record<string, string>> = json?.records || [];

    // Group by variety, take max modal price as the latest indicative value
    const byVariety = new Map<string, JuteScrapeRow>();
    for (const r of records) {
      const variety = (r.variety || '').trim() || 'Other';
      const modal = parseFloat(r.modal_price || r.modal_x0020_price || '0');
      if (!modal || Number.isNaN(modal)) continue;
      const existing = byVariety.get(variety);
      if (!existing || modal > existing.modalPriceQtl) {
        byVariety.set(variety, {
          variety,
          modalPriceQtl: modal,
          market: r.market,
          state: r.state,
          arrivalDate: r.arrival_date,
        });
      }
    }
    return Array.from(byVariety.values());
  } catch (e) {
    console.error('[scraper:jute] failed', e);
    return [];
  }
}
