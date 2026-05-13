import mongoose, { Schema, Model } from 'mongoose';

export interface IPriceAlertDoc {
  product: mongoose.Types.ObjectId;
  email?: string;
  whatsapp?: string;
  name?: string;
  isActive: boolean;
  notifiedAt?: Date | null;
}

const PriceAlertSchema = new Schema<IPriceAlertDoc>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    whatsapp: { type: String, default: '', trim: true },
    name: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    notifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

PriceAlertSchema.index({ product: 1, email: 1 }, { unique: false });
PriceAlertSchema.index({ product: 1, whatsapp: 1 }, { unique: false });

const PriceAlert: Model<IPriceAlertDoc> =
  mongoose.models.PriceAlert || mongoose.model<IPriceAlertDoc>('PriceAlert', PriceAlertSchema);

export default PriceAlert;
