import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 60;

interface Props {
  searchParams: { search?: string; category?: string; page?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;

  let query = supabaseAdmin.from('products').select('*, category:categories(name, slug)', { count: 'exact' }).eq('status', 'published');
  if (searchParams.search) query = query.ilike('title', `%${searchParams.search}%`);
  if (searchParams.category) query = query.eq('category_id', searchParams.category);

  const from = (page - 1) * limit;
  query = query.order('created_at', { ascending: false }).range(from, from + limit - 1);
  const { data: products, count } = await query;

  const { data: categories } = await supabaseAdmin.from('categories').select('*').order('name');
  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-900/5">
        <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black text-primary font-headline tracking-tight">Spy Web Cams</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className="font-headline font-bold tracking-tight text-primary border-b-2 border-primary pb-1">All Products</Link>
              {(categories || []).slice(0, 3).map(c => (
                <Link key={c.id} href={`/category/${c.slug}`} className="font-headline font-bold tracking-tight text-slate-600 hover:text-primary transition-all">{c.name}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <form action="/products" className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline">search</span>
              <input name="search" defaultValue={searchParams.search} className="bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-outline ml-2 w-64 outline-none" placeholder="Search deals..." />
            </form>
          </div>
        </nav>
      </header>

      <main className="pt-28 pb-20 px-6 max-w-screen-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            {searchParams.search ? `Results for "${searchParams.search}"` : 'All Deals'}
          </h1>
          <p className="text-on-surface-variant">{count || 0} products found</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/products" className={`px-5 py-2 rounded-full font-headline font-bold text-sm transition-all ${!searchParams.category ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-primary/10'}`}>All</Link>
          {(categories || []).map(c => (
            <Link key={c.id} href={`/category/${c.slug}`} className="px-5 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-headline font-bold text-sm hover:bg-primary/10 transition-all">{c.name}</Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(products || []).map((product) => (
            <div key={product.id} className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-outline-variant/10">
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  {product.image_url ? (
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={product.image_url} alt={product.title} />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center"><span className="material-symbols-outlined text-5xl text-outline">image</span></div>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
              </Link>
              <div className="p-6">
                <span className="font-label text-xs font-bold text-outline uppercase tracking-widest mb-2 block">{product.category?.name || 'Uncategorized'}</span>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-xl font-headline font-bold text-on-surface mb-3 line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                </Link>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-black text-on-surface">{product.price ? `CA$${product.price}` : 'See Price'}</span>
                </div>
                <Link href={`/go/${product.slug}`} className="flex items-center justify-center w-full h-12 bg-secondary text-white font-headline font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-secondary/20 active:scale-95">
                  Get Deal<span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {(products || []).length === 0 && (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
            <p className="text-xl font-bold">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-16">
            {page > 1 && <Link href={`/products?page=${page - 1}${searchParams.search ? `&search=${searchParams.search}` : ''}`} className="px-6 py-3 rounded-full bg-surface-container-low font-bold hover:bg-primary hover:text-white transition-all">Previous</Link>}
            <span className="px-6 py-3 text-on-surface-variant font-medium">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/products?page=${page + 1}${searchParams.search ? `&search=${searchParams.search}` : ''}`} className="px-6 py-3 rounded-full bg-surface-container-low font-bold hover:bg-primary hover:text-white transition-all">Next</Link>}
          </div>
        )}
      </main>

      <footer className="bg-slate-50 w-full py-12 px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs tracking-wide uppercase text-slate-400">© 2026 Spy Web Cams. All rights reserved.</span>
          <div className="flex gap-6 text-xs tracking-wide uppercase text-slate-400">
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Privacy</a>
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Terms</a>
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Affiliate Disclosure</a>
          </div>
        </div>
      </footer>
    </>
  );
}
