export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  options: FilterOption[];
}

// Filters for New PP Bags & New BOPP Bags
const ppBoppFilters: FilterDefinition[] = [
  {
    key: 'quality',
    label: 'Quality',
    options: [
      { value: 'super-gold', label: 'Super Gold' },
      { value: 'gold', label: 'Gold' },
      { value: 'silver', label: 'Silver' },
      { value: 'janta', label: 'Janta' },
    ],
  },
  {
    key: 'gram',
    label: 'Gram (Weight per bag)',
    options: [
      { value: '2', label: '2 Gram' },
      { value: '2.5', label: '2.5 Gram' },
      { value: '3', label: '3 Gram' },
      { value: '3.5', label: '3.5 Gram' },
      { value: '4', label: '4 Gram' },
      { value: '4.25', label: '4.25 Gram' },
      { value: '4.50', label: '4.50 Gram' },
      { value: '5', label: '5 Gram' },
      { value: '5.25', label: '5.25 Gram' },
      { value: '5.50', label: '5.50 Gram' },
    ],
  },
  {
    key: 'lamination',
    label: 'Lamination Type',
    options: [
      { value: 'laminated', label: 'Laminated' },
      { value: 'unlaminated', label: 'Unlaminated' },
    ],
  },
  {
    key: 'availability',
    label: 'Availability',
    options: [
      { value: 'ready-stock', label: 'Ready Stock' },
      { value: 'make-to-order', label: 'Make-to-Order' },
    ],
  },
  {
    key: 'fillerContent',
    label: 'Filler Content %',
    options: [
      { value: '5-10', label: '5% – 10%' },
      { value: '10-20', label: '10% – 20%' },
      { value: '20-30', label: '20% – 30%' },
      { value: '30-40', label: '30% – 40%' },
      { value: '40-45', label: '40% – 45%' },
    ],
  },
];

// Filters for PP Granules
const ppGranulesFilters: FilterDefinition[] = [
  {
    key: 'grade',
    label: 'Grade',
    options: [
      { value: 'rafiya', label: 'Rafiya Grade' },
      { value: 'rp', label: 'RP Grade' },
    ],
  },
  {
    key: 'mfi',
    label: 'Melt Flow Index (MFI)',
    options: [
      { value: '2-4', label: '2–4' },
      { value: '4-6', label: '4–6' },
      { value: '6-8', label: '6–8' },
      { value: '8-12', label: '8–12' },
    ],
  },
  {
    key: 'color',
    label: 'Color',
    options: [
      { value: 'natural', label: 'Natural' },
      { value: 'milky-white', label: 'Milky White' },
      { value: 'mixed', label: 'Mixed' },
      { value: 'black', label: 'Black' },
    ],
  },
  {
    key: 'moisture',
    label: 'Moisture Level',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    key: 'contamination',
    label: 'Contamination Level',
    options: [
      { value: 'clean', label: 'Clean' },
      { value: 'semi-clean', label: 'Semi Clean' },
      { value: 'industrial-mix', label: 'Industrial Mix' },
    ],
  },
  {
    key: 'application',
    label: 'Application',
    options: [
      { value: 'raffia-tape', label: 'Raffia Tape' },
      { value: 'injection-molding', label: 'Injection Molding' },
      { value: 'extrusion', label: 'Extrusion' },
      { value: 'general-purpose', label: 'General Purpose' },
    ],
  },
];

// Basic filters for all other categories
const basicFilters: FilterDefinition[] = [
  {
    key: 'condition',
    label: 'Condition',
    options: [
      { value: 'new', label: 'New' },
      { value: 'old', label: 'Used' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
  {
    key: 'size',
    label: 'Size',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'extra-large', label: 'Extra Large' },
    ],
  },
  {
    key: 'application',
    label: 'Application',
    options: [
      { value: 'packaging', label: 'Packaging' },
      { value: 'storage', label: 'Storage' },
      { value: 'industrial', label: 'Industrial' },
      { value: 'agriculture', label: 'Agriculture' },
      { value: 'food', label: 'Food Grade' },
    ],
  },
  {
    key: 'material',
    label: 'Material',
    options: [
      { value: 'pp', label: 'Polypropylene (PP)' },
      { value: 'hdpe', label: 'HDPE' },
      { value: 'jute', label: 'Jute' },
      { value: 'nylon', label: 'Nylon' },
    ],
  },
  {
    key: 'availability',
    label: 'Availability',
    options: [
      { value: 'ready-stock', label: 'Ready Stock' },
      { value: 'make-to-order', label: 'Make-to-Order' },
    ],
  },
];

// Category slug → filter definitions mapping
// Subcategory slugs for New PP Bags and New BOPP Bags get special filters
const categoryFilterMap: Record<string, FilterDefinition[]> = {
  // PP Bags subcategories
  'new-pp-bags': ppBoppFilters,
  // BOPP Bags subcategories
  'new-bopp-bags': ppBoppFilters,
  // PP Granules
  'pp-granules': ppGranulesFilters,
  'rafiya-grade': ppGranulesFilters,
  'rp-grade': ppGranulesFilters,
};

export function getFiltersForCategory(categorySlug: string, subcategorySlug?: string): FilterDefinition[] {
  if (subcategorySlug && categoryFilterMap[subcategorySlug]) {
    return categoryFilterMap[subcategorySlug];
  }
  if (categoryFilterMap[categorySlug]) {
    return categoryFilterMap[categorySlug];
  }
  return basicFilters;
}

export function getAllFilterKeys(): string[] {
  const keys = new Set<string>();
  [...ppBoppFilters, ...ppGranulesFilters, ...basicFilters].forEach((f) => keys.add(f.key));
  return Array.from(keys);
}
