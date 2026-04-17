'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Product, DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, publishedProducts: 0, scheduledProducts: 0, draftProducts: 0, totalClicks: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allProducts, clicks] = await Promise.all([
        supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false }),
        supabase.from('utm_clicks').select('id', { count: 'exact', head: true }),
      ]);

      const products = allProducts.data || [];
      setStats({
        totalProducts: products.length,
        publishedProducts: products.filter(p => p.status === 'published').length,
        scheduledProducts: products.filter(p => p.status === 'scheduled').length,
        draftProducts: products.filter(p => p.status === 'draft').length,
        totalClicks: clicks.count || 0,
      });
      setRecentProducts(products.slice(0, 10));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
    setLoading(false);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: 'bg-tertiary-container text-on-tertiary-container',
      scheduled: 'bg-secondary-container/20 text-secondary-container',
      draft: 'bg-outline-variant text-on-surface-variant',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${styles[status] || styles.draft}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      {/* Top Header */}
      <header className="h-24 px-8 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-slate-900/5">
        <div>
          <h2 className="text-2xl font-black text-primary font-headline tracking-tight">Welcome, Admin!</h2>
          <p className="text-sm text-on-surface-variant">Here&apos;s what&apos;s happening with your affiliate store today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <input
              className="bg-surface-container-low border-none rounded-xl py-2.5 pl-11 pr-4 w-64 text-sm focus:ring-2 focus:ring-primary transition-all"
              placeholder="Search products..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-xl bg-surface-container-low text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2.5 rounded-xl bg-surface-container-low text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Quick Actions */}
        <section className="flex flex-wrap gap-4">
          <Link href="/admin/products/new" className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-headline font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined">add_circle</span>
            Add Product
          </Link>
          <Link href="/admin/queue" className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-headline font-bold shadow-sm border-2 border-primary/10 hover:border-primary/30 transition-all">
            <span className="material-symbols-outlined">queue</span>
            View Queue
          </Link>
          <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-tertiary-container text-on-tertiary-container rounded-xl font-headline font-bold shadow-xl shadow-tertiary-container/20 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined">open_in_new</span>
            View Store
          </Link>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-primary">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined p-2 bg-primary/10 text-primary rounded-lg">inventory_2</span>
              <span className="text-tertiary text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +12%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">Total Products</p>
              <h3 className="text-3xl font-black font-headline mt-1">
                {loading ? '...' : stats.totalProducts.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-tertiary">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined p-2 bg-tertiary/10 text-tertiary rounded-lg">check_circle</span>
              <span className="text-tertiary text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +5%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">Published</p>
              <h3 className="text-3xl font-black font-headline mt-1">
                {loading ? '...' : stats.publishedProducts.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-secondary-container">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined p-2 bg-secondary-container/10 text-secondary-container rounded-lg">schedule</span>
              <span className="text-on-surface-variant text-xs font-bold">{stats.draftProducts} Drafts</span>
            </div>
            <div className="mt-4">
              <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider">Scheduled/Drafts</p>
              <h3 className="text-3xl font-black font-headline mt-1">
                {loading ? '...' : (stats.scheduledProducts + stats.draftProducts).toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="p-6 bg-primary text-white rounded-2xl shadow-xl shadow-primary/10 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-9xl">ads_click</span>
            </div>
            <div className="flex justify-between items-start relative z-10">
              <span className="material-symbols-outlined p-2 bg-white/20 text-white rounded-lg">ads_click</span>
              <span className="text-white/80 text-xs font-bold">This Month</span>
            </div>
            <div className="mt-4 relative z-10">
              <p className="text-white/70 font-medium text-xs uppercase tracking-wider">Affiliate Clicks</p>
              <h3 className="text-3xl font-black font-headline mt-1">
                {loading ? '...' : stats.totalClicks >= 1000 ? `${(stats.totalClicks / 1000).toFixed(1)}K` : stats.totalClicks}
              </h3>
            </div>
          </div>
        </section>

        {/* Recent Products Table */}
        <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 flex justify-between items-center bg-surface-container-low/50 border-b border-surface-container">
            <div>
              <h3 className="text-xl font-bold font-headline">Recent Products</h3>
              <p className="text-sm text-on-surface-variant">Management view of the latest 10 items added to the catalog.</p>
            </div>
            <Link href="/admin/products" className="text-primary font-bold text-sm hover:underline">View All Products</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-outline">Product</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Status</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-outline text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-on-surface-variant">Loading...</td></tr>
                ) : recentProducts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-on-surface-variant">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-4xl text-outline">inventory_2</span>
                      <p>No products yet. <Link href="/admin/products/new" className="text-primary font-bold hover:underline">Add your first product</Link></p>
                    </div>
                  </td></tr>
                ) : recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        {product.image_url ? (
                          <img className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" src={product.image_url} alt={product.title} />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">image</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm leading-tight">{product.title}</p>
                          <p className="text-[11px] text-outline">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{product.category?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm font-bold">{product.price ? `CA$${product.price}` : '—'}</td>
                    <td className="px-6 py-4">{statusBadge(product.status)}</td>
                    <td className="px-8 py-4 text-right">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-outline hover:text-primary transition-colors inline-block">
                        <span className="material-symbols-outlined">edit</span>
                      </Link>
                      <button className="p-2 text-outline hover:text-error transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-surface-container-low/20 flex justify-center">
            <Link href="/admin/products" className="text-sm font-bold py-2 px-6 rounded-full border border-outline-variant hover:bg-white transition-all">
              Load More Activity
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 mt-12">
        <p className="text-xs tracking-wide uppercase text-slate-400">© 2026 Temu Manager. All rights reserved.</p>
        <div className="flex gap-8">
          <a className="text-xs tracking-wide uppercase text-slate-400 hover:text-primary underline underline-offset-4 transition-all" href="#">Privacy Policy</a>
          <a className="text-xs tracking-wide uppercase text-slate-400 hover:text-primary underline underline-offset-4 transition-all" href="#">Terms of Service</a>
          <a className="text-xs tracking-wide uppercase text-slate-400 hover:text-primary underline underline-offset-4 transition-all" href="#">Contact Support</a>
        </div>
      </footer>
    </>
  );
}
