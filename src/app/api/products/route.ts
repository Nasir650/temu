import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { slugify, generateAffiliateUrl, ensureUniqueSlug } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let query = supabaseAdmin.from('products').select('*, category:categories(name, slug)', { count: 'exact' });

  if (status) query = query.eq('status', status);
  else query = query.eq('status', 'published'); // Default public: published only

  if (category) query = query.eq('category_id', category);
  if (search) query = query.ilike('title', `%${search}%`);

  const from = (page - 1) * limit;
  query = query.order('created_at', { ascending: false }).range(from, from + limit - 1);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ products: data || [], total: count || 0, page, limit });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image_url, temu_url, price, category_id, tags, slug: rawSlug, status, scheduled_at } = body;

    if (!title || !temu_url) {
      return NextResponse.json({ error: 'Title and Temu URL are required' }, { status: 400 });
    }

    const baseSlug = rawSlug || slugify(title);
    const slug = await ensureUniqueSlug(baseSlug, supabaseAdmin);
    const affiliate_url = generateAffiliateUrl(temu_url, slug);

    const { data, error } = await supabaseAdmin.from('products').insert({
      title, description: description || null, image_url: image_url || null,
      temu_url, affiliate_url, slug, category_id: category_id || null,
      price: price || null, tags: tags || [], status: status || 'draft',
      scheduled_at: scheduled_at || null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
