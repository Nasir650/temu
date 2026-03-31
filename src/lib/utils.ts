import slugifyLib from 'slugify';

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function buildUTMParams(slug: string): string {
  const params = new URLSearchParams({
    utm_source: 'yoursite',
    utm_medium: 'affiliate',
    utm_campaign: 'temu',
    utm_content: slug,
  });
  return params.toString();
}

export function generateAffiliateUrl(temuUrl: string, slug: string): string {
  const affiliateTag = process.env.AFFILIATE_TAG || '';
  const separator = temuUrl.includes('?') ? '&' : '?';
  const utmParams = buildUTMParams(slug);
  let url = `${temuUrl}${separator}${utmParams}`;
  if (affiliateTag) {
    url += `&affiliate_tag=${affiliateTag}`;
  }
  return url;
}

export async function ensureUniqueSlug(
  baseSlug: string,
  supabaseClient: any,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabaseClient
      .from('products')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data } = await query;
    if (!data || data.length === 0) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'N/A';
  return `$${price.toFixed(2)}`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
