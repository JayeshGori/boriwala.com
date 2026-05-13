import mongoose, { Schema, Model } from 'mongoose';

export interface IBannerDoc {
  title: string;
  subtitle?: string;
  image: string;          // base64 data URL or hosted URL
  mobileImage?: string;   // optional mobile-specific image
  ctaText?: string;
  ctaUrl?: string;
  textPosition: 'left' | 'center' | 'right';
  overlay: boolean;       // dark overlay for text readability
  badge?: string;         // optional small label e.g. "NEW", "OFFER"
  order: number;
  isActive: boolean;
}

const BannerSchema = new Schema<IBannerDoc>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },
    textPosition: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
    overlay: { type: Boolean, default: true },
    badge: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BannerSchema.index({ order: 1, isActive: 1 });

const Banner: Model<IBannerDoc> =
  mongoose.models.Banner || mongoose.model<IBannerDoc>('Banner', BannerSchema);

export default Banner;
