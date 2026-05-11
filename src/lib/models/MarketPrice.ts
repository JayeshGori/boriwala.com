import mongoose, { Schema, Model } from 'mongoose';

export type PriceCategory = 'polymer' | 'jute';
export type PriceTrend = 'up' | 'down' | 'flat';

export interface IMarketPriceDoc {
  name: string;            // e.g. "PP Raffia"
  grade?: string;          // e.g. "Repol H110MA"
  category: PriceCategory;
  unit: string;            // e.g. "₹/kg", "₹/quintal"
  price: number;
  previousPrice: number;
  trend: PriceTrend;
  changePct: number;       // percent change vs previous
  source: string;          // e.g. "RIL", "AGMARKNET", "Plastemart"
  sourceUrl?: string;
  manualOverride: boolean; // if true, scraper won't overwrite
  isActive: boolean;
  displayOrder: number;
  note?: string;
  lastUpdated: Date;
}

const MarketPriceSchema = new Schema<IMarketPriceDoc>(
  {
    name: { type: String, required: true },
    grade: { type: String, default: '' },
    category: { type: String, enum: ['polymer', 'jute'], required: true, index: true },
    unit: { type: String, default: '₹/kg' },
    price: { type: Number, required: true },
    previousPrice: { type: Number, default: 0 },
    trend: { type: String, enum: ['up', 'down', 'flat'], default: 'flat' },
    changePct: { type: Number, default: 0 },
    source: { type: String, default: 'Manual' },
    sourceUrl: { type: String, default: '' },
    manualOverride: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    note: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MarketPriceSchema.index({ isActive: 1, displayOrder: 1 });

const MarketPrice: Model<IMarketPriceDoc> =
  mongoose.models.MarketPrice || mongoose.model<IMarketPriceDoc>('MarketPrice', MarketPriceSchema);

export default MarketPrice;
