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
    utm_source: 'temu-store',
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
    // Use Temu's referral_code param (matches temu.to/k/ short link tracking)
    url += `&referral_code=${affiliateTag}`;
  }
  return url;
}

/**
 * PRIMARY AFFILIATE LINK — Use this everywhere in the store.
 *
 * https://temu.to/k/gf9w1s2ec2q  (Code: alj060136)
 *
 * This single link is smart — Temu shows different offers based on user type:
 *   - New / Reinstalled App users → CA$100 Coupon Bundle (30% Off)
 *   - ALL other users             → "Save Big" deals
 *
 * ✅ Best choice: covers every visitor, maximizes conversions.
 */
export const TEMU_PRIMARY_LINK = 'https://temu.to/k/gf9w1s2ec2q';

/**
 * Returns your Temu affiliate short links by offer type.
 * Default is the best-converting "Save Big / CA$100" link (works for ALL users).
 */
export function getTemuAffiliateLink(type: 'primary' | 'gifts' | 'deal' = 'primary'): string {
  switch (type) {
    case 'gifts':   return 'https://temu.to/k/gypp9w7wl1b'; // CA$0 Gifts — App User Only
    case 'deal':    return 'https://temu.to/k/ghrafl2tcgo';  // Exclusive Deal — New App User
    case 'primary':
    default:        return TEMU_PRIMARY_LINK; // ✅ Save Big / CA$100 — ALL Users
  }
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
