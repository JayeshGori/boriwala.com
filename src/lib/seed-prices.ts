import MarketPrice from './models/MarketPrice';

// Seed defaults — used on first run when collection is empty.
// Admin can edit/delete these anytime via /admin/prices.
export const DEFAULT_PRICES = [
  // ----- POLYMERS -----
  { name: 'PP Raffia',        grade: 'H110MA',      category: 'polymer', unit: '₹/kg', price: 102.5, source: 'RIL',         displayOrder: 1 },
  { name: 'PP Injection',     grade: 'H030SG',      category: 'polymer', unit: '₹/kg', price: 104.0, source: 'RIL',         displayOrder: 2 },
  { name: 'HDPE Blow',        grade: 'B5604',       category: 'polymer', unit: '₹/kg', price: 108.0, source: 'RIL',         displayOrder: 3 },
  { name: 'HDPE Film',        grade: 'F46003',      category: 'polymer', unit: '₹/kg', price: 110.5, source: 'RIL',         displayOrder: 4 },
  { name: 'LDPE Film',        grade: '24FS040',     category: 'polymer', unit: '₹/kg', price: 122.0, source: 'GAIL',        displayOrder: 5 },
  { name: 'LLDPE Film',       grade: 'M26500S',     category: 'polymer', unit: '₹/kg', price: 112.5, source: 'GAIL',        displayOrder: 6 },
  { name: 'PVC Suspension',   grade: 'K-67',        category: 'polymer', unit: '₹/kg', price: 88.5,  source: 'Reliance',    displayOrder: 7 },
  { name: 'PET Bottle Grade', grade: 'CB-602',      category: 'polymer', unit: '₹/kg', price: 95.0,  source: 'Reliance',    displayOrder: 8 },
  // ----- JUTE -----
  { name: 'Raw Jute TD-5',    grade: 'TD-5',        category: 'jute',    unit: '₹/quintal', price: 5650, source: 'AGMARKNET', displayOrder: 9 },
  { name: 'Raw Jute TD-6',    grade: 'TD-6',        category: 'jute',    unit: '₹/quintal', price: 5350, source: 'AGMARKNET', displayOrder: 10 },
  { name: 'Mesta',            grade: '',            category: 'jute',    unit: '₹/quintal', price: 4900, source: 'AGMARKNET', displayOrder: 11 },
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
