-- =============================================
-- TEMU AFFILIATE MANAGER — DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  temu_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UTM Clicks tracking table
CREATE TABLE IF NOT EXISTS utm_clicks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_scheduled ON products(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_utm_clicks_slug ON utm_clicks(product_slug);
CREATE INDEX IF NOT EXISTS idx_utm_clicks_date ON utm_clicks(clicked_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_clicks ENABLE ROW LEVEL SECURITY;

-- Products: public can read published, authenticated can do everything
CREATE POLICY "Public can read published products" ON products
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users have full access to products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Categories: public can read, authenticated can manage
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- UTM Clicks: anyone can insert (for tracking), authenticated can read
CREATE POLICY "Anyone can insert clicks" ON utm_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read clicks" ON utm_clicks
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- SEED DATA (Optional sample categories)
-- =============================================
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Home & Garden', 'home-garden'),
  ('Fashion', 'fashion'),
  ('Beauty & Health', 'beauty-health'),
  ('Sports & Outdoors', 'sports-outdoors'),
  ('Kids & Baby', 'kids-baby'),
  ('Office & School', 'office-school')
ON CONFLICT (slug) DO NOTHING;
