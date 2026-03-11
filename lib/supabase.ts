import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  file_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  product?: Product;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}
