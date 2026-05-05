import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface Props { params: { slug: string }; searchParams: { page?: string }; }

export default async function CategoryPage({ params, searchParams }: Props) {
  const { data: category } = await supabaseAdmin.from('categories').select('*').eq('slug', params.slug).single();
  if (!category) notFound();

  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const from = (page - 1) * limit;

  const { data: products, count } = await supabaseAdmin.from('products').select('*, category:categories(name, slug)', { count: 'exact' }).eq('status', 'published').eq('category_id', category.id).order('created_at', { ascending: false }).range(from, from + limit - 1);

  const { data: categories } = await supabaseAdmin.from('categories').select('*').order('name');
  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-900/5">
        <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black text-primary font-headline tracking-tight">Spy Web Cams</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className="font-headline font-bold tracking-tight text-slate-600 hover:text-primary transition-all">All Products</Link>
              {(categories || []).slice(0, 3).map(c => (
                <Link key={c.id} href={`/category/${c.slug}`} className={`font-headline font-bold tracking-tight transition-all ${c.id === category.id ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-600 hover:text-primary'}`}>{c.name}</Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-28 pb-20 px-6 max-w-screen-2xl mx-auto">
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-outline font-medium mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface">{category.name}</span>
          </nav>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">{category.name}</h1>
          <p className="text-on-surface-variant">{count || 0} deals in this category</p>
        </div>

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
                </div>
              </Link>
              <div className="p-6">
                <span className="font-label text-xs font-bold text-outline uppercase tracking-widest mb-2 block">{category.name}</span>
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
            <span className="material-symbols-outlined text-5xl mb-4 block">category</span>
            <p className="text-xl font-bold">No products in this category yet</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-16">
            {page > 1 && <Link href={`/category/${params.slug}?page=${page - 1}`} className="px-6 py-3 rounded-full bg-surface-container-low font-bold hover:bg-primary hover:text-white transition-all">Previous</Link>}
            <span className="px-6 py-3 text-on-surface-variant font-medium">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/category/${params.slug}?page=${page + 1}`} className="px-6 py-3 rounded-full bg-surface-container-low font-bold hover:bg-primary hover:text-white transition-all">Next</Link>}
          </div>
        )}
      </main>

      <footer className="bg-slate-50 w-full py-12 px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs tracking-wide uppercase text-slate-400">© 2026 Spy Web Cams. All rights reserved.</span>
          <div className="flex gap-6 text-xs tracking-wide uppercase text-slate-400">
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Privacy</a>
            <a href="#" className="hover:text-primary underline underline-offset-4 transition-all">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
