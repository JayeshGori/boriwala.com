import mongoose, { Schema, Document } from 'mongoose';

export interface ISellerEnquiryDoc extends Document {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  city: string;
  materialType: string;
  materialDescription: string;
  quantity: string;
  videoLinks: string[];
  photos: string[];
  status: 'new' | 'contacted' | 'negotiating' | 'closed' | 'rejected';
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerEnquirySchema = new Schema<ISellerEnquiryDoc>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    companyName: { type: String, default: '' },
    city: { type: String, required: true },
    materialType: { type: String, required: true },
    materialDescription: { type: String, default: '' },
    quantity: { type: String, required: true },
    videoLinks: [{ type: String }],
    photos: [{ type: String }],
    status: { type: String, enum: ['new', 'contacted', 'negotiating', 'closed', 'rejected'], default: 'new' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.SellerEnquiry || mongoose.model<ISellerEnquiryDoc>('SellerEnquiry', SellerEnquirySchema);
