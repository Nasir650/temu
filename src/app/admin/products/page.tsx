'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const perPage = 20;

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [statusFilter, categoryFilter, search, page]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*, category:categories(name)', { count: 'exact' });

    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (categoryFilter !== 'all') query = query.eq('category_id', categoryFilter);
    if (search) query = query.ilike('title', `%${search}%`);

    const from = (page - 1) * perPage;
    query = query.order('created_at', { ascending: false }).range(from, from + perPage - 1);

    const { data, count } = await query;
    setProducts(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected products?`)) return;
    for (const id of selectedIds) {
      await supabase.from('products').delete().eq('id', id);
    }
    setSelectedIds([]);
    fetchProducts();
  };

  const handleBulkPublish = async () => {
    for (const id of selectedIds) {
      await supabase.from('products').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', id);
    }
    setSelectedIds([]);
    fetchProducts();
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/go/${slug}`;
    navigator.clipboard.writeText(url);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalPages = Math.ceil(totalCount / perPage);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: 'bg-tertiary-container text-on-tertiary-container',
      scheduled: 'bg-secondary-container/20 text-secondary-container',
      draft: 'bg-outline-variant text-on-surface-variant',
    };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${styles[status] || styles.draft}`}>{status}</span>;
  };

  return (
    <>
      <header className="h-24 px-8 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-slate-900/5">
        <div>
          <h2 className="text-2xl font-black text-primary font-headline tracking-tight">Products</h2>
          <p className="text-sm text-on-surface-variant">Manage all your affiliate product listings.</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-headline font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          Add Product
        </Link>
      </header>

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-outline">search</span>
          </div>

          <select
            className="bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>

          <select
            className="bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <span className="text-sm font-bold text-primary">{selectedIds.length} selected</span>
            <button onClick={handleBulkPublish} className="px-4 py-2 bg-tertiary-container text-on-tertiary-container rounded-lg text-xs font-bold">Publish Selected</button>
            <button onClick={handleBulkDelete} className="px-4 py-2 bg-error text-on-error rounded-lg text-xs font-bold">Delete Selected</button>
            <button onClick={() => setSelectedIds([])} className="px-4 py-2 text-on-surface-variant text-xs font-bold">Clear</button>
          </div>
        )}

        {/* Products Table */}
        <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={(e) => setSelectedIds(e.target.checked ? products.map(p => p.id) : [])}
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Product</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Scheduled</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-16 text-on-surface-variant">
                    <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                  </td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-on-surface-variant">No products found.</td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.image_url ? (
                          <img className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" src={product.image_url} alt="" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center"><span className="material-symbols-outlined text-outline">image</span></div>
                        )}
                        <div>
                          <p className="font-bold text-sm leading-tight">{product.title}</p>
                          <p className="text-[11px] text-outline">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{product.category?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm font-bold">{product.price ? `$${product.price}` : '—'}</td>
                    <td className="px-6 py-4">{statusBadge(product.status)}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{product.scheduled_at ? new Date(product.scheduled_at).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-outline hover:text-primary transition-colors inline-block"><span className="material-symbols-outlined text-xl">edit</span></Link>
                      <Link href={`/products/${product.slug}`} target="_blank" className="p-2 text-outline hover:text-primary transition-colors inline-block"><span className="material-symbols-outlined text-xl">visibility</span></Link>
                      <button onClick={() => copyLink(product.slug)} className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">content_copy</span></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 flex justify-between items-center border-t border-surface-container">
              <p className="text-sm text-on-surface-variant">Showing {((page-1)*perPage)+1}-{Math.min(page*perPage, totalCount)} of {totalCount}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg bg-surface-container-low text-sm font-bold disabled:opacity-30">Previous</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg bg-surface-container-low text-sm font-bold disabled:opacity-30">Next</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
