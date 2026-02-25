import mongoose, { Schema, Model } from 'mongoose';

export interface IProductDoc {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  video?: string;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  condition: 'new' | 'old';
  price?: number;
  showPrice: boolean;
  specifications: { key: string; value: string }[];
  moq: string;
  availability: 'in_stock' | 'out_of_stock' | 'on_demand';
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  material?: string;
  productType?: string;
}

const ProductSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    images: [{ type: String }],
    video: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    condition: { type: String, enum: ['new', 'old'], default: 'new' },
    price: { type: Number, default: null },
    showPrice: { type: Boolean, default: false },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    moq: { type: String, default: '1' },
    availability: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'on_demand'],
      default: 'in_stock',
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    material: { type: String, default: '' },
    productType: { type: String, default: '' },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ condition: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product: Model<IProductDoc> =
  mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);

export default Product;
