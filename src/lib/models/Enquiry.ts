import mongoose, { Schema, Model } from 'mongoose';

export interface IEnquiryDoc {
  name: string;
  phone: string;
  email: string;
  companyName?: string;
  productName?: string;
  productId?: mongoose.Types.ObjectId;
  quantity?: string;
  message: string;
  isResponded: boolean;
  respondedAt?: Date;
  notes?: string;
}

const EnquirySchema = new Schema<IEnquiryDoc>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    companyName: { type: String, default: '' },
    productName: { type: String, default: '' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    quantity: { type: String, default: '' },
    message: { type: String, required: true },
    isResponded: { type: Boolean, default: false },
    respondedAt: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ isResponded: 1 });

const Enquiry: Model<IEnquiryDoc> =
  mongoose.models.Enquiry || mongoose.model<IEnquiryDoc>('Enquiry', EnquirySchema);

export default Enquiry;
