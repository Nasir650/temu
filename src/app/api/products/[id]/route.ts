import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { slugify, generateAffiliateUrl, ensureUniqueSlug } from '@/lib/utils';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, image_url, temu_url, price, category_id, tags, slug: rawSlug, status, scheduled_at } = body;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (temu_url !== undefined) updateData.temu_url = temu_url;
    if (price !== undefined) updateData.price = price;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (tags !== undefined) updateData.tags = tags;
    if (status !== undefined) updateData.status = status;
    if (scheduled_at !== undefined) updateData.scheduled_at = scheduled_at;

    if (rawSlug) {
      updateData.slug = await ensureUniqueSlug(rawSlug, supabaseAdmin, params.id);
    }
    if (temu_url && (rawSlug || updateData.slug)) {
      const s = (updateData.slug || rawSlug) as string;
      updateData.affiliate_url = generateAffiliateUrl(temu_url, s);
    }

    const { data, error } = await supabaseAdmin.from('products').update(updateData).eq('id', params.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
