export interface Product {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  temu_url: string;
  affiliate_url: string;
  slug: string;
  category_id: string | null;
  price: number | null;
  tags: string[];
  status: 'draft' | 'scheduled' | 'published';
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  product_count?: number;
}

export interface UTMClick {
  id: string;
  product_slug: string;
  referrer: string | null;
  user_agent: string | null;
  clicked_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  scheduledProducts: number;
  draftProducts: number;
  totalClicks: number;
}

export interface ClickAnalytics {
  byProduct: { slug: string; title: string; clicks: number }[];
  byDate: { date: string; clicks: number }[];
  total: number;
}
