import mongoose, { Schema, Model } from 'mongoose';

export interface IReviewDoc {
  product: mongoose.Types.ObjectId;
  buyer?: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  companyName?: string;
  rating: number;        // 1..5
  title?: string;
  comment: string;
  videoUrl?: string;     // YouTube/file URL
  imageUrls?: string[];
  isApproved: boolean;
  isFeatured: boolean;
  isVerified: boolean;   // true when posted by approved logged-in buyer
  source: 'website' | 'admin';
}

const ReviewSchema = new Schema<IReviewDoc>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    companyName: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    comment: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    imageUrls: [{ type: String }],
    isApproved: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    source: { type: String, enum: ['website', 'admin'], default: 'website' },
  },
  { timestamps: true },
);

ReviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });

const Review: Model<IReviewDoc> =
  mongoose.models.Review || mongoose.model<IReviewDoc>('Review', ReviewSchema);

export default Review;
