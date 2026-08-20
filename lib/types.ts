export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type InquiryStatus =
  | 'new'
  | 'read'
  | 'replied'
  | 'archived';

export type CareerStatus =
  | 'new'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'accepted';

export type NewsletterStatus =
  | 'active'
  | 'unsubscribed';

export type AdminRole =
  | 'admin'
  | 'super_admin';

export type ServiceCategory =
  | 'photography'
  | 'videography'
  | 'printing'
  | 'graphic_design'
  | 'editing'
  | 'custom';

export type GalleryCategory =
  | 'Weddings'
  | 'Portraits'
  | 'Fashion'
  | 'Commercial'
  | 'Events'
  | 'Cinematic';

export type GalleryAspectRatio =
  | 'portrait'
  | 'landscape'
  | 'square';

export interface AdminRecord {
  id: string;
  email: string;
  password_hash?: string;
  role: AdminRole | string;
  created_at?: string;
  updated_at?: string | null;
}

export interface BookingRecord {
  id?: string;
  _id?: string;

  client_name?: string;
  client_email?: string;
  client_phone?: string | null;

  service_package?: string | null;
  service?: string | null;
  package?: string | null;

  location?: string | null;

  event_date?: string | null;
  event_time?: string | null;

  date?: string | null;
  time?: string | null;

  photographer?: string | null;

  total_price?: number | null;

  notes?: string | null;

  status: BookingStatus;

  name?: string | null;
  email?: string | null;
  phone?: string | null;

  created_at?: string;
  updated_at?: string | null;
}

export interface ContactInquiryRecord {
  id?: string;
  _id?: string;

  name?: string;
  email?: string;
  phone?: string | null;

  subject?: string | null;
  message?: string | null;

  service_interest?: string | null;

  status: InquiryStatus;

  created_at?: string;
  updated_at?: string | null;

  createdAt?: string | Date;
}

export interface CareerRecord {
  id?: string;
  name?: string;
  email?: string;
  position?: string;
  portfolio?: string | null;
  message?: string;
  status?: CareerStatus | string;
  created_at?: string;
  updated_at?: string | null;
}

export interface NewsletterSubscriberRecord {
  id?: string;
  email: string;
  status?: NewsletterStatus | string;
  created_at?: string;
  updated_at?: string | null;
}

export interface ServiceRecord {
  id?: string;
  _id?: string;

  name?: string | null;
  title: string;

  slug?: string | null;

  description?: string | null;

  short_description?: string | null;
  full_description?: string | null;

  category?: ServiceCategory | string | null;

  price?: number | null;
  duration?: string | null;

  image_url?: string | null;

  features?: string[] | null;

  is_popular?: boolean;
  is_active?: boolean;

  sort_order?: number;

  created_at?: string;
  updated_at?: string | null;
}

export interface GalleryItemRecord {
  id?: string;
  _id?: string;

  title: string;

  image?: string | null;
  image_url: string;

  category: GalleryCategory;

  aspect_ratio?: GalleryAspectRatio | null;

  description?: string | null;

  is_featured?: boolean;
  featured?: boolean;

  is_active?: boolean;

  sort_order?: number;

  created_at?: string;
  updated_at?: string | null;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;

  totalMessages: number;
  newMessages: number;
  repliedMessages: number;

  totalServices: number;
  activeServices: number;

  totalGalleryItems: number;
  activeGalleryItems: number;

  totalCareers: number;
  totalSubscribers: number;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

export type ApiResponse<T = unknown> =
  | ApiSuccess<T>
  | ApiError;
