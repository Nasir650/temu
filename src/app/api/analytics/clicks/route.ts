import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: clicks } = await supabaseAdmin.from('utm_clicks').select('product_slug, clicked_at');
    const total = clicks?.length || 0;

    // By product
    const productMap: Record<string, number> = {};
    (clicks || []).forEach(c => { productMap[c.product_slug] = (productMap[c.product_slug] || 0) + 1; });
    const byProduct = Object.entries(productMap).map(([slug, count]) => ({ slug, clicks: count })).sort((a, b) => b.clicks - a.clicks).slice(0, 20);

    // By date (last 30 days)
    const dateMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      dateMap[d.toISOString().split('T')[0]] = 0;
    }
    (clicks || []).forEach(c => {
      const day = new Date(c.clicked_at).toISOString().split('T')[0];
      if (dateMap[day] !== undefined) dateMap[day]++;
    });
    const byDate = Object.entries(dateMap).map(([date, clicks]) => ({ date, clicks }));

    return NextResponse.json({ total, byProduct, byDate });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
