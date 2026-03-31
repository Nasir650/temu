import { NextResponse } from 'next/server';

function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    // Temu URLs look like: /pk-en/1pc-storage-container-multifunctional-leak-proof...
    // Extract the product slug part
    const parts = path.split('/').filter(Boolean);
    // Find the longest slug-like part (the product name)
    let productSlug = '';
    for (const part of parts) {
      if (part.includes('-') && part.length > productSlug.length) {
        productSlug = part;
      }
    }
    if (!productSlug) return '';
    // Clean and convert slug to title
    return productSlug
      .replace(/\.html$/i, '')
      .replace(/-g-\d+.*$/i, '') // Remove goods ID suffix
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch {
    return '';
  }
}

function extractDescriptionFromTitle(title: string): string {
  if (!title) return '';
  return `Great deal on ${title}. Check out this product on Temu for the best price available.`;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    let title = '';
    let description = '';
    let image = '';

    // Method 1: Try OG scraper with realistic headers
    try {
      const ogs = (await import('open-graph-scraper')).default;
      const { result } = await ogs({
        url,
        timeout: 15000,
        fetchOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
        },
      });
      title = result.ogTitle || result.dcTitle || '';
      description = result.ogDescription || result.dcDescription || '';
      image = result.ogImage?.[0]?.url || '';
    } catch (e) {
      console.log('[OG Fetch] OG scraper failed, falling back to URL parsing:', e);
    }

    // Method 2: Try raw HTML fetch with regex as fallback
    if (!title) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          redirect: 'follow',
        });
        const html = await res.text();

        // Try to extract from <title> tag
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1] && !titleMatch[1].includes('Temu |')) {
          title = titleMatch[1].replace(/ \| Temu.*$/i, '').replace(/-\s*Temu.*$/i, '').trim();
        }

        // Try meta description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        if (descMatch && descMatch[1]) {
          description = descMatch[1];
        }

        // Try og:image
        const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        if (imgMatch && imgMatch[1]) {
          image = imgMatch[1];
        }

        // Try JSON-LD structured data
        const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/i);
        if (jsonLdMatch) {
          try {
            const jsonLd = JSON.parse(jsonLdMatch[1]);
            if (jsonLd.name && !title) title = jsonLd.name;
            if (jsonLd.description && !description) description = jsonLd.description;
            if (jsonLd.image && !image) image = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image;
          } catch {}
        }
      } catch (e) {
        console.log('[OG Fetch] Raw HTML fetch failed:', e);
      }
    }

    // Method 3: Extract from URL as last resort
    if (!title) {
      title = extractTitleFromUrl(url);
    }
    if (!description) {
      description = extractDescriptionFromTitle(title);
    }

    // Method 4: Try Temu goods API for image and price
    if (!image || !title) {
      try {
        // Extract goods ID from URL (pattern: -g-601099527111288)
        const goodsMatch = url.match(/-g-(\d+)/);
        if (goodsMatch) {
          const goodsId = goodsMatch[1];
          // Try Temu's mobile API endpoint
          const apiRes = await fetch(`https://www.temu.com/api/poppy/v1/opt/get?goods_id=${goodsId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
              'Accept': 'application/json',
            },
          });
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (apiData?.result?.goods?.hdThumbUrl && !image) {
              image = apiData.result.goods.hdThumbUrl;
            }
            if (apiData?.result?.goods?.minGroupPrice && !title) {
              // Price comes in cents sometimes
            }
          }
        }
      } catch (e) {
        console.log('[OG Fetch] Temu API fallback failed:', e);
      }
    }

    // Return a hint if image is still missing
    const imageHint = !image ? 'Right-click the product image on Temu and copy image URL' : '';

    return NextResponse.json({ title, description, image, imageHint });
  } catch (error) {
    console.error('OG fetch error:', error);
    // Even on total failure, try to extract from URL
    try {
      const { url } = await request.clone().json();
      const title = extractTitleFromUrl(url);
      return NextResponse.json({
        title,
        description: extractDescriptionFromTitle(title),
        image: '',
      });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch OG data' }, { status: 500 });
    }
  }
}
