export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Trek {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  duration_days: number;
  price_per_person: number;
  max_group_size: number;
  start_location: string;
  end_location: string;
  image_url: string | null;
  gallery_urls: string[];
  payment_link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Homestay {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  price_per_night: number;
  amenities: string[];
  image_url: string | null;
  gallery_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  trek_id: string | null;
  homestay_id: string | null;
  booking_date: string;
  end_date: string | null;
  number_of_persons: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_id: string | null;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  customer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  trek_id: string | null;
  homestay_id: string | null;
  rating: number;
  comment: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
