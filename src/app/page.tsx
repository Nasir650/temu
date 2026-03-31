import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export const revalidate = 60;

async function getProducts() {
  const { data } = await supabaseAdmin.from('products').select('*, category:categories(name, slug)').eq('status', 'published').order('created_at', { ascending: false }).limit(12);
  return data || [];
}

async function getCategories() {
  const { data } = await supabaseAdmin.from('categories').select('*').order('name');
  return data || [];
}

const testimonials = [
  { name: 'Sarah M.', role: 'Verified Buyer', text: "Found incredible deals I couldn't believe were real. Fast shipping and quality products every time!", rating: 5 },
  { name: 'Mike R.', role: 'Repeat Customer', text: 'This site curates the best Temu finds. Saved me hours of searching through thousands of products.', rating: 5 },
  { name: 'Jessica L.', role: 'Smart Shopper', text: 'The deals are legit! Got an amazing haul for under $50. My go-to for bargain hunting.', rating: 5 },
  { name: 'David K.', role: 'Deal Hunter', text: 'Best curated deal site out there. Every product recommendation has been a winner for me.', rating: 5 },
];

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const featuredProducts = products.slice(0, 4);
  const moreProducts = products.slice(4, 8);
  const newArrivals = products.slice(0, 3);

  return (
    <>
      {/* ───── NAVBAR ───── */}
      <Navbar />

      <main className="pt-16">
        {/* ───── HERO ───── */}
        <section className="relative min-h-[600px] lg:min-h-[680px] overflow-hidden bg-forest-900">
          <div className="absolute inset-0 z-0">
            <img src="/images/hero-shopping.jpg" alt="Shopping deals" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-900/80 to-forest-900/50"></div>
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center min-h-[600px] lg:min-h-[680px]">
            <div className="max-w-2xl py-16">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-200 text-xs tracking-widest uppercase font-semibold">Curated Daily Selection</span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.6rem] font-bold text-white leading-[1.15] mb-6">
                Top <span className="font-headline italic text-amber-400 text-5xl md:text-6xl lg:text-[4.2rem]">Temu Deals</span><br />
                & Curated Finds
              </h1>
              <p className="text-cream-300 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                Our team scours thousands of Temu products daily to handpick the best deals, highest quality items, and hidden gems — so you don&apos;t have to.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-forest-950 text-sm font-bold rounded-full hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
                  Shop Deals <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
                <Link href="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white text-sm font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md">
                  Browse All
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-6 ml-auto">
              <div className="stat-circle">
                <span className="text-3xl font-bold text-white">90%</span>
                <span className="text-[10px] text-cream-300 mt-0.5">Savings</span>
              </div>
              <div className="flex flex-wrap gap-2 max-w-[220px] justify-end">
                {['Verified Deals','Daily Picks','Best Prices'].map(t=>(
                  <span key={t} className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/10 backdrop-blur-md text-cream-100 border border-white/15">{t}</span>
                ))}
              </div>
              {products.length > 0 && (
                <div className="flex -space-x-3 mt-2">
                  {products.slice(0,3).map((p:any)=>(
                    p.image_url && <div key={p.id} className="w-12 h-12 rounded-full border-2 border-forest-800 overflow-hidden"><img src={p.image_url} alt={p.title} className="w-full h-full object-cover"/></div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-forest-800 bg-forest-700 flex items-center justify-center text-white text-[10px] font-bold">+{products.length}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ───── FEATURED PRODUCTS ───── */}
        <section className="py-16 lg:py-20 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-forest-600 font-medium mb-1">Handpicked by Our Team</p>
              <h2 className="text-2xl md:text-3xl font-headline font-bold text-forest-900">Today&apos;s Best ✦ <span className="font-body font-bold">Deals</span></h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-forest-900 hover:text-forest-600 transition-colors">
              View all deals <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any, i: number) => {
                const tags = ['Hot Deal','New','Top Rated','Flash Sale'];
                const tagClasses = ['tag-promotion','tag-new','tag-favorite','tag-promotion'];
                return (
                  <div key={product.id} className="product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-cream-200/60 group">
                    <div className="relative p-4">
                      <span className={`tag-badge ${tagClasses[i % 4]} absolute top-6 left-6 z-10`}>{tags[i % 4]}</span>
                      <div className="relative h-52 bg-cream-100 rounded-xl overflow-hidden flex items-center justify-center">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} className="product-img w-full h-full object-cover transition-transform duration-700" />
                        ) : (
                          <span className="material-symbols-outlined text-5xl text-cream-400">shopping_bag</span>
                        )}
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <span className="text-[10px] font-semibold text-forest-600 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</span>
                      <p className="text-[13px] text-on-surface-variant leading-snug mb-3 mt-1 line-clamp-2">{product.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-forest-900">{product.price ? `$${product.price}` : 'See Price'}</span>
                        <Link href={`/go/${product.slug}`} className="flex items-center gap-1 px-4 py-2 bg-forest-900 text-white text-xs font-semibold rounded-lg hover:bg-forest-700 transition-colors">
                          Get Deal <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-cream-100/50 rounded-3xl">
              <span className="material-symbols-outlined text-5xl text-cream-400 mb-4 block">storefront</span>
              <p className="text-xl font-bold text-forest-900">No deals yet</p>
              <p className="text-sm text-on-surface-variant mt-2">New curated deals are added daily. Check back soon!</p>
            </div>
          )}
        </section>

        {/* ───── CATEGORIES ───── */}
        <section className="py-12 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-forest-900">Shop by <span className="italic">Category</span></h2>
            <Link href="/products" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-forest-900 hover:text-forest-600">
              All categories <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat: any) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative h-48 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-forest-800 to-forest-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-900/50 to-forest-800/30"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="material-symbols-outlined text-4xl text-cream-200 mb-3 group-hover:scale-110 transition-transform">category</span>
                    <p className="text-[11px] text-cream-400 mb-0.5">Explore</p>
                    <h3 className="text-white font-bold text-base">{cat.name}</h3>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[14px]">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Electronics','Fashion','Home & Garden','Beauty'].map(name=>(
                <div key={name} className="relative h-48 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-forest-800 to-forest-950 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-cream-200 mb-3">category</span>
                  <h3 className="text-white font-bold text-base">{name}</h3>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ───── BEST SELLERS ───── */}
        <section className="py-16 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-cream-200/50 rounded-3xl overflow-hidden">
            <div className="h-72 md:h-[420px] bg-forest-100 flex items-center justify-center relative overflow-hidden">
              {products.length > 0 && products[0].image_url ? (
                <img src={products[0].image_url} alt={products[0].title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-7xl text-forest-300">local_fire_department</span>
                  <p className="text-forest-400 mt-2 font-medium">Top Sellers</p>
                </div>
              )}
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-forest-900 mb-4">Best Sellers</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 max-w-md">
                These are the most popular Temu finds — top-rated products with thousands of orders and rave reviews. Handpicked for unbeatable quality and price.
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white text-sm font-semibold rounded-full hover:bg-forest-700 transition-all">
                Shop Best Sellers <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ───── NEW ARRIVALS ───── */}
        <section className="py-12 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-[#e8ddd0]/50 rounded-3xl overflow-hidden">
            <div className="p-8 md:p-12 order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-forest-900 mb-3">
                New <span className="italic">Arrivals</span>
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 max-w-md">
                Fresh deals added daily! Be the first to grab newly discovered Temu gems — trending products at unbelievable prices before they sell out.
              </p>
              <Link href="/products" className="text-sm font-semibold text-forest-900 underline underline-offset-4 hover:text-forest-600 transition-colors">
                See what&apos;s new →
              </Link>
              {newArrivals.length > 0 && (
                <div className="flex gap-3 mt-6">
                  {newArrivals.map((p:any) => (
                    <Link key={p.id} href={`/go/${p.slug}`} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-cream-300 hover:border-forest-500 transition-colors">
                      {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-cream-200 flex items-center justify-center"><span className="material-symbols-outlined text-cream-400 text-sm">image</span></div>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="h-72 md:h-[380px] order-1 md:order-2 bg-forest-100 flex items-center justify-center relative overflow-hidden">
              {products.length > 1 && products[1].image_url ? (
                <img src={products[1].image_url} alt={products[1].title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-7xl text-forest-300">new_releases</span>
                  <p className="text-forest-400 mt-2 font-medium">Just Added</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ───── MORE PRODUCTS GALLERY ───── */}
        <section className="py-16 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm text-on-surface-variant mb-1">More Handpicked Finds</p>
              <h2 className="text-2xl md:text-3xl font-headline font-bold text-forest-900">Trending ✦ <span className="font-body font-bold">Products</span></h2>
            </div>
            <div className="flex gap-2">
              <Link href="/products" className="nav-arrow"><span className="material-symbols-outlined text-[18px]">arrow_forward</span></Link>
            </div>
          </div>
          {moreProducts.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4">
              {moreProducts.map((p: any) => (
                <Link key={p.id} href={`/go/${p.slug}`} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                  <div className="w-[70px] h-[70px] rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-forest-500 transition-all group-hover:-translate-y-1">
                    {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-cream-200 flex items-center justify-center"><span className="material-symbols-outlined text-cream-400">image</span></div>}
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-medium whitespace-nowrap max-w-[80px] truncate">{p.title.split(' ').slice(0,2).join(' ')}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-on-surface-variant py-8">More products coming soon!</p>
          )}
        </section>

        {/* ───── REVIEWS ───── */}
        <section className="py-16 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="bg-cream-200/40 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="md:w-1/3 flex flex-col justify-center">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-headline font-bold text-forest-900">4.9</span>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s=>(<span key={s} className="material-symbols-outlined star-filled text-[18px]" style={{fontVariationSettings:"'FILL' 1"}}>star</span>))}</div>
                </div>
                <p className="text-sm text-on-surface-variant mb-1">Trusted by <strong className="text-forest-900">50,000+</strong> Smart Shoppers</p>
                <p className="text-xs text-on-surface-variant">Curated Temu Deals You Can Trust</p>
              </div>
              <div className="md:w-2/3 grid sm:grid-cols-2 gap-5">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(s=>(<span key={s} className="material-symbols-outlined star-filled text-[14px]" style={{fontVariationSettings:"'FILL' 1"}}>star</span>))}</div>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center text-forest-800 text-xs font-bold">{t.name.split(' ').map(n=>n[0]).join('')}</div>
                      <div>
                        <p className="text-xs font-semibold text-forest-900">{t.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───── CTA BANNER ───── */}
        <section className="py-12 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 p-10 md:p-16 text-center">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-forest-400/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-4">Never Miss a Deal</h2>
              <p className="text-cream-300 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                Join 50,000+ smart shoppers who discover the best Temu deals every day. We curate, you save — it&apos;s that simple. 🔥
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input className="flex-1 h-12 px-5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-cream-400 text-sm outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Enter your email" type="email" />
                <button className="h-12 px-6 bg-amber-500 text-forest-950 font-bold text-sm rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">Subscribe</button>
              </div>
              <p className="mt-3 text-[11px] text-cream-400">Unsubscribe anytime. We respect your privacy.</p>
            </div>
          </div>
        </section>
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="bg-forest-900 w-full pt-16 pb-8 px-6 lg:px-10 mt-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <span className="font-script text-3xl italic text-white block mb-4">Temu Deals</span>
              <p className="text-cream-300 text-sm leading-relaxed mb-4">Your trusted destination for curated Temu affiliate deals. We analyze trends and reviews to bring you the best value.</p>
              <p className="text-[10px] text-cream-500 italic leading-relaxed">PRICING DISCLAIMER: Prices and availability are subject to change. As an affiliate, we may earn from qualifying purchases.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2.5">
                {['All Deals','Flash Sales','New Arrivals','Categories'].map(l=>(<Link key={l} href="/products" className="text-cream-400 text-[13px] hover:text-white transition-colors">{l}</Link>))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <div className="flex flex-col gap-2.5">
                {[{label:'Privacy Policy',href:'/privacy'},{label:'Terms of Service',href:'/terms'},{label:'Affiliate Disclosure',href:'/affiliate-disclosure'},{label:'Cookie Policy',href:'/cookies'}].map(l=>(<Link key={l.label} href={l.href} className="text-cream-400 text-[13px] hover:text-white transition-colors">{l.label}</Link>))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
              <div className="flex flex-col gap-2.5">
                {[{label:'Contact Us',href:'/contact'},{label:'FAQ',href:'/faq'},{label:'How It Works',href:'/how-it-works'},{label:'About Us',href:'/about'}].map(l=>(<Link key={l.label} href={l.href} className="text-cream-400 text-[13px] hover:text-white transition-colors">{l.label}</Link>))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-forest-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-cream-400 text-xs">© 2026 Temu Deals. All rights reserved.</span>
            <div className="flex gap-4">
              {[{label:'Privacy',href:'/privacy'},{label:'Terms',href:'/terms'},{label:'Affiliate Disclosure',href:'/affiliate-disclosure'}].map(l=>(<Link key={l.label} href={l.href} className="text-cream-500 text-xs hover:text-white transition-colors">{l.label}</Link>))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
