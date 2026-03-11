-- PaperPe Database Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products (indicators)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  file_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles ON DELETE SET NULL,
  product_id UUID REFERENCES products ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Downloads (track download attempts)
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT
);

-- 5. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Ticket Replies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read/update own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Anyone can read active products
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);

-- Orders: Users can view own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Downloads: Users can view own downloads
CREATE POLICY "Users can view own downloads" ON downloads FOR SELECT 
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Support Tickets: Users can view/create own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ticket Replies: Users can view replies on own tickets
CREATE POLICY "Users can view own ticket replies" ON ticket_replies FOR SELECT 
  USING (ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid()));
CREATE POLICY "Users can reply to own tickets" ON ticket_replies FOR INSERT 
  WITH CHECK (ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid()) AND sender = 'user');

-- Waitlist: Anyone can insert (signup)
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- Coupons: Anyone can read active coupons
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial products
INSERT INTO products (slug, name, description, price, original_price, is_active) VALUES
('aria-supreme', 'ARIA SUPREME', '7-in-1 trading indicator with score-based signals, trend detection, smart money tracking, and India market awareness.', 2999, 5999, true),
('oi-pulse', 'OI Pulse', 'Track smart money through Open Interest changes. Real-time OI tracking, PCR analysis, and institutional position detection.', 999, 1999, true),
('fear-greed', 'Fear & Greed Meter', 'Visual fear and greed indicator for timing entries. Buy when fearful, sell when greedy.', 499, 999, true),
('smart-sr', 'Smart S/R', 'Auto-detect key support and resistance levels. Strength scoring and dynamic updates.', 999, 1999, true),
('complete-bundle', 'Complete Bundle', 'All 4 indicators at a massive discount. ARIA SUPREME + OI Pulse + Fear & Greed + Smart S/R.', 3999, 8996, true)
ON CONFLICT (slug) DO NOTHING;

-- Done!
SELECT 'Database setup complete!' as status;
