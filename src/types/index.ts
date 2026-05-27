export type Language = 'en' | 'uk' | 'ru' | 'fr' | 'ar';

export type Theme = 'light' | 'dark';

export type PropertyType = 'house' | 'apartment' | 'villa' | 'penthouse';

export type PropertyStatus = 'available' | 'sold' | 'reserved';

export type InquiryStatus = 'new' | 'read' | 'replied';

export type PreferredContact = 'email' | 'whatsapp' | 'telegram';

export interface MultilingualText {
  en: string;
  uk: string;
  ru: string;
  fr: string;
  ar: string;
}

export interface Property {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  price: number;
  currency: string;
  location: string;
  address: string | null;
  property_type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area_size: number;
  features: string[];
  images: string[];
  video_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyInquiry {
  id: string;
  property_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  preferred_contact: PreferredContact;
  status: InquiryStatus;
  created_at: string;
  property?: Property;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
