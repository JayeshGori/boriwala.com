import mongoose, { Schema, Model } from 'mongoose';

export type PriceUnit = 'piece' | 'kg' | 'set' | 'meter' | 'roll' | 'bag' | 'dozen' | 'box';
export type DispatchStatus = 'ready_stock' | 'in_production';

export interface IProductVariantGroup {
  name: string;        // e.g. 'Quality', 'Size', 'Color'
  values: string[];    // e.g. ['Gold', 'Silver', 'Semi Silver', 'Janta']
}

export interface IProductDoc {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  video?: string;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  condition: 'new' | 'old' | 'rejected';
  price?: number;
  showPrice: boolean;
  // --- Phase 1: advanced pricing
  priceUnit: PriceUnit;
  gstIncluded: boolean;
  gstRate: number;
  // --- Phase 1: dispatch
  dispatchStatus: DispatchStatus;
  dispatchDays?: number;          // override default days
  stockPincode?: string;          // origin pincode for transport calc (Phase 3)
  // --- Phase 1: additional spec fields
  gsm?: string;
  thickness?: string;
  weight?: string;
  capacity?: string;
  // --- Phase 1: simple variants
  variants: IProductVariantGroup[];
  // existing fields
  specifications: { key: string; value: string }[];
  filterAttributes: Record<string, string>;
  moq: string;
  availability: 'in_stock' | 'out_of_stock' | 'on_demand' | 'make_to_order';
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  material?: string;
  productType?: string;
  size?: string;
  application?: string;
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
    condition: { type: String, enum: ['new', 'old', 'rejected'], default: 'new' },
    price: { type: Number, default: null },
    showPrice: { type: Boolean, default: false },
    priceUnit: {
      type: String,
      enum: ['piece', 'kg', 'set', 'meter', 'roll', 'bag', 'dozen', 'box'],
      default: 'piece',
    },
    gstIncluded: { type: Boolean, default: false },
    gstRate: { type: Number, default: 18 },
    dispatchStatus: {
      type: String,
      enum: ['ready_stock', 'in_production'],
      default: 'ready_stock',
    },
    dispatchDays: { type: Number, default: null },
    stockPincode: { type: String, default: '' },
    gsm: { type: String, default: '' },
    thickness: { type: String, default: '' },
    weight: { type: String, default: '' },
    capacity: { type: String, default: '' },
    variants: {
      type: [
        {
          name: { type: String, required: true },
          values: [{ type: String }],
        },
      ],
      default: [],
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    filterAttributes: { type: Map, of: String, default: {} },
    moq: { type: String, default: '1' },
    availability: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'on_demand', 'make_to_order'],
      default: 'in_stock',
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    material: { type: String, default: '' },
    productType: { type: String, default: '' },
    size: { type: String, default: '' },
    application: { type: String, default: '' },
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
