import mongoose, { Schema, Model } from 'mongoose';

export interface IUserDoc {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  role: 'admin' | 'editor' | 'buyer';
  isActive: boolean;
  isApproved: boolean;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    companyName: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'editor', 'buyer'], default: 'buyer' },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUserDoc> =
  mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);

export default User;
