'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export default function AdminQueue() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchQueue(); }, []);

  const fetchQueue = async () => {
    const { data } = await supabase.from('products').select('*, category:categories(name)').eq('status', 'scheduled').order('scheduled_at', { ascending: true });
    setProducts(data || []);
    setLoading(false);
  };

  const publishNow = async (id: string) => {
    await supabase.from('products').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', id);
    fetchQueue();
  };

  const removeFromQueue = async (id: string) => {
    await supabase.from('products').update({ status: 'draft', scheduled_at: null, updated_at: new Date().toISOString() }).eq('id', id);
    fetchQueue();
  };

  return (
    <>
      <header className="h-24 px-8 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-slate-900/5">
        <div>
          <h2 className="text-2xl font-black text-primary font-headline tracking-tight">Publish Queue</h2>
          <p className="text-sm text-on-surface-variant">Products scheduled for automatic publishing.</p>
        </div>
      </header>

      <div className="p-8">
        <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-outline">Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Scheduled For</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-outline text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-16"><span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span></td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-on-surface-variant">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-4xl text-outline">schedule</span>
                      <p>No products in the queue.</p>
                    </div>
                  </td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        {product.image_url ? <img className="w-10 h-10 rounded-xl object-cover" src={product.image_url} alt="" /> : <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center"><span className="material-symbols-outlined text-outline text-sm">image</span></div>}
                        <p className="font-bold text-sm">{product.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.category?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm font-bold">{product.price ? `$${product.price}` : '—'}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{product.scheduled_at ? new Date(product.scheduled_at).toLocaleString() : '—'}</td>
                    <td className="px-8 py-4 text-right whitespace-nowrap">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-outline hover:text-primary transition-colors inline-block"><span className="material-symbols-outlined text-xl">edit</span></Link>
                      <button onClick={() => publishNow(product.id)} className="px-3 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-lg text-xs font-bold ml-2">Publish Now</button>
                      <button onClick={() => removeFromQueue(product.id)} className="px-3 py-1.5 bg-outline-variant/20 text-on-surface-variant rounded-lg text-xs font-bold ml-2">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
