export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingRecord {
  _id?: string;
  id?: string;
  client_name?: string;
  client_email?: string;
  service_package?: string;
  location?: string;
  event_date?: string;
  total_price?: number;
  notes?: string;
  status: BookingStatus;
  [key: string]: any;
}

export interface ContactInquiryRecord {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status: InquiryStatus;
  createdAt?: string | Date;
  [key: string]: any;
}

export interface ServiceRecord {
  _id?: string;
  id?: string;
  name?: string;
  title: string;
  description?: string;
  price?: number;
  [key: string]: any;
}

export interface GalleryItemRecord {
  _id?: string;
  id?: string;
  title: string;
  image?: string;
  image_url: string;
  category: 'Weddings' | 'Portraits' | 'Fashion' | 'Commercial' | 'Events' | 'Cinematic';
  aspect_ratio?: 'portrait' | 'landscape' | 'square';
  [key: string]: any;
}

export type InquiryStatus = 'new' | 'read' | 'replied' | 'archived';
