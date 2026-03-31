import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { slug, referrer, userAgent } = await request.json();
    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    await supabaseAdmin.from('utm_clicks').insert({ product_slug: slug, referrer: referrer || null, user_agent: userAgent || null });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
