import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

interface Props { params: { slug: string }; }

export default async function GoRedirect({ params }: Props) {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('affiliate_url, slug')
    .eq('slug', params.slug)
    .single();

  if (!product || !product.affiliate_url) {
    redirect('/');
  }

  // Log click asynchronously (non-blocking)
  supabaseAdmin.from('utm_clicks').insert({
    product_slug: params.slug,
    referrer: null,
    user_agent: null,
  }).then(() => {}).catch(() => {});

  // Redirect immediately
  redirect(product.affiliate_url);
}
