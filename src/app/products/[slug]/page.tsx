import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

interface Props { params: { slug: string }; }

export default async function ProductDetail({ params }: Props) {
  const { data: product } = await supabaseAdmin.from('products').select('*, category:categories(name, slug)').eq('slug', params.slug).eq('status', 'published').single();

  if (!product) notFound();

  const { data: related } = await supabaseAdmin.from('products').select('*, category:categories(name)').eq('status', 'published').neq('id', product.id).eq('category_id', product.category_id).limit(4);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-900/5">
        <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black text-primary font-headline tracking-tight">Temu Deals</Link>
            <nav className="hidden md:flex gap-6 items-center font-headline font-bold tracking-tight">
              <Link href="/products" className="text-slate-600 hover:text-primary transition-all">Categories</Link>
              <Link href="/products" className="text-slate-600 hover:text-primary transition-all">Flash Sales</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <form action="/products" className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline">search</span>
              <input name="search" className="bg-transparent border-none focus:ring-0 text-sm w-64 outline-none" placeholder="Search deals..." />
            </form>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-screen-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-outline font-medium">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </>
          )}
          <span className="text-on-surface">{product.title}</span>
        </nav>

        {/* Product Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm">
              {product.image_url ? (
                <img className="w-full h-full object-cover" src={product.image_url} alt={product.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                  <span className="material-symbols-outlined text-8xl text-outline">image</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold uppercase tracking-wider">Top Rated</span>
                {product.category && (
                  <Link href={`/category/${product.category.slug}`} className="text-sm font-semibold text-primary hover:underline">{product.category.name}</Link>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight font-headline">{product.title}</h1>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-secondary">{product.price ? `$${product.price}` : 'See Price on Temu'}</span>
              </div>
              <p className="text-[11px] text-outline mt-3 leading-relaxed italic">Price shown at time of entry. Check Temu for current price.</p>
            </div>

            <div className="flex flex-col gap-4">
              <Link href={`/go/${product.slug}`} className="group relative flex items-center justify-center gap-3 w-full py-5 bg-secondary text-white rounded-xl font-bold text-lg shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <span className="relative z-10">Get Deal Now</span>
                <span className="material-symbols-outlined relative z-10">trending_flat</span>
                <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <div className="flex items-center justify-center gap-6 text-xs text-outline font-medium">
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">verified_user</span> Secure Checkout</div>
                <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">local_shipping</span> Fast Delivery</div>
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant/10">
                <span className="text-sm font-bold text-on-surface">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-surface-container-highest rounded-lg text-xs font-bold text-on-surface-variant">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Description */}
        {product.description && (
          <section className="mt-24 max-w-4xl">
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight text-on-surface font-headline">Product Overview</h2>
            <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg">
              <p>{product.description}</p>
            </div>
          </section>
        )}

        {/* Related Products */}
        {related && related.length > 0 && (
          <section className="mt-32">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight font-headline">More from {product.category?.name || 'This Category'}</h2>
                <p className="text-outline font-medium">Curated deals you might also love.</p>
              </div>
              {product.category && (
                <Link href={`/category/${product.category.slug}`} className="text-primary font-bold flex items-center gap-1 hover:underline underline-offset-4">
                  View All <span className="material-symbols-outlined text-sm">open_in_new</span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((item) => (
                <div key={item.id} className="group flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                  <Link href={`/products/${item.slug}`} className="aspect-square overflow-hidden relative block">
                    {item.image_url ? (
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={item.image_url} alt={item.title} />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center"><span className="material-symbols-outlined text-4xl text-outline">image</span></div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col gap-3">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-secondary">{item.price ? `$${item.price}` : 'See Price'}</span>
                    </div>
                    <Link href={`/products/${item.slug}`} className="mt-2 w-full py-3 bg-surface-container text-on-surface rounded-xl text-xs font-bold text-center group-hover:bg-primary group-hover:text-white transition-all block">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-50 w-full py-12 px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-lg font-black text-primary font-headline tracking-tight">Temu Deals</span>
            <p className="text-slate-400 text-xs">© 2026 Temu Deals. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs tracking-wide uppercase text-slate-400">
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Terms of Service</a>
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Affiliate Disclosure</a>
          </div>
        </div>
      </footer>
    </>
  );
}
