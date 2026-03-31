import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { slugify, generateAffiliateUrl, ensureUniqueSlug } from '@/lib/utils';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, image_url, temu_url, source, bookmarklet_secret } = body;

    // Verify secret
    if (bookmarklet_secret !== process.env.BOOKMARKLET_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    // Validate
    if (!temu_url || !temu_url.includes('temu.com')) {
      return NextResponse.json({ success: false, error: 'Invalid Temu URL' }, { status: 400, headers: corsHeaders });
    }

    const productTitle = title || 'Untitled Temu Product';
    const baseSlug = slugify(productTitle);
    const slug = await ensureUniqueSlug(baseSlug, supabaseAdmin);
    const affiliate_url = generateAffiliateUrl(temu_url, slug);

    const cleanPrice = price ? parseFloat(String(price).replace(/[^0-9.]/g, '')) : null;

    const { data, error } = await supabaseAdmin.from('products').insert({
      title: productTitle,
      description: null,
      image_url: image_url || null,
      temu_url,
      affiliate_url,
      slug,
      category_id: null,
      price: isNaN(cleanPrice as number) ? null : cleanPrice,
      tags: [],
      status: 'draft',
      scheduled_at: null,
    }).select().single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      slug: data.slug,
      message: 'Product saved as draft',
    }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500, headers: corsHeaders });
  }
}
