import mongoose, { Schema, Model } from 'mongoose';

export interface ISettingsDoc {
  companyName: string;
  tagline: string;
  phone: string[];
  email: string[];
  address: string;
  whatsappNumber: string;
  googleMapEmbed: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  aboutUs: string;
  aboutUsShort: string;
  experience: string;
  infrastructure: string;
  certifications: string[];
  strengths: string[];
  logo?: string;
  heroImages: string[];
  heroTitle: string;
  heroSubtitle: string;
}

const SettingsSchema = new Schema<ISettingsDoc>(
  {
    companyName: { type: String, default: 'Boriwala Trading Co.' },
    tagline: { type: String, default: 'Your Trusted B2B Trading Partner' },
    phone: [{ type: String }],
    email: [{ type: String }],
    address: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    googleMapEmbed: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    aboutUs: { type: String, default: '' },
    aboutUsShort: { type: String, default: '' },
    experience: { type: String, default: '15+ Years' },
    infrastructure: { type: String, default: '' },
    certifications: [{ type: String }],
    strengths: [{ type: String }],
    logo: { type: String, default: '' },
    heroImages: [{ type: String }],
    heroTitle: { type: String, default: 'Your Trusted B2B Trading Partner' },
    heroSubtitle: {
      type: String,
      default: 'Dealing in PP Bags, Jute Bags, Plastic Products, Packaging Materials & More',
    },
  },
  { timestamps: true }
);

const Settings: Model<ISettingsDoc> =
  mongoose.models.Settings || mongoose.model<ISettingsDoc>('Settings', SettingsSchema);

export default Settings;
