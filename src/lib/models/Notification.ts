import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDoc extends Document {
  title: string;
  body: string;
  type: 'offer' | 'price_drop' | 'new_product' | 'general';
  sentCount: number;
  failedCount: number;
  sentAt: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDoc>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ['offer', 'price_drop', 'new_product', 'general'], default: 'general' },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotificationDoc>('Notification', NotificationSchema);
