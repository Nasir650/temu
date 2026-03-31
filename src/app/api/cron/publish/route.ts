import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ status: 'published', updated_at: now })
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .select('id');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, published: data?.length || 0 });
  } catch {
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
