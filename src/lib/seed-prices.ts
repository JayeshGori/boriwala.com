import MarketPrice from './models/MarketPrice';

// Seed defaults — used on first run when collection is empty.
// Admin can edit/delete these anytime via /admin/prices.
export const DEFAULT_PRICES = [
  { name: 'PP',         grade: 'Benchmark',  category: 'polymer', unit: '₹/kg',      price: 102.5, source: 'RIL Benchmark',           displayOrder: 1 },
  { name: 'HDPE',       grade: 'Benchmark',  category: 'polymer', unit: '₹/kg',      price: 108.0, source: 'RIL Benchmark',           displayOrder: 2 },
  { name: 'LLDPE',      grade: 'Benchmark',  category: 'polymer', unit: '₹/kg',      price: 112.5, source: 'RIL Benchmark',           displayOrder: 3 },
  { name: 'Jute',       grade: 'Mandi Avg',  category: 'jute',    unit: '₹/quintal', price: 5650,  source: 'AGMARKNET',               displayOrder: 4 },
  { name: 'Jute MSP',   grade: 'TD-3',       category: 'jute',    unit: '₹/quintal', price: 5650,  source: 'Jute Commissioner of India', displayOrder: 5 },
] as const;

export async function seedPricesIfEmpty() {
  const count = await MarketPrice.countDocuments();
  if (count > 0) return;
  await MarketPrice.insertMany(
    DEFAULT_PRICES.map((p) => ({
      ...p,
      previousPrice: p.price,
      trend: 'flat',
      changePct: 0,
      isActive: true,
      manualOverride: false,
      lastUpdated: new Date(),
    }))
  );
}
