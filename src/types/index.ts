export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: string | null;
  subcategories?: ICategory[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  video?: string;
  category: string | ICategory;
  subcategory?: string | ICategory;
  condition: 'new' | 'old';
  price?: number;
  showPrice: boolean;
  specifications: ISpecification[];
  moq: string;
  availability: 'in_stock' | 'out_of_stock' | 'on_demand';
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  material?: string;
  productType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEnquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  companyName?: string;
  productName?: string;
  productId?: string;
  quantity?: string;
  message: string;
  isResponded: boolean;
  respondedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISiteSettings {
  _id: string;
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}
