import mongoose, { Schema, Document } from 'mongoose';

export interface IPushTokenDoc extends Document {
  token: string;
  platform: 'android' | 'ios';
  deviceName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PushTokenSchema = new Schema<IPushTokenDoc>(
  {
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ['android', 'ios'], default: 'android' },
    deviceName: { type: String, default: 'Unknown' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PushToken || mongoose.model<IPushTokenDoc>('PushToken', PushTokenSchema);
