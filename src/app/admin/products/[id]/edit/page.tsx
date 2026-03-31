'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const [form, setForm] = useState({
    temu_url: '', title: '', description: '', image_url: '', price: '',
    category_id: '', tags: [] as string[], slug: '',
    status: 'draft' as 'draft' | 'scheduled' | 'published', scheduled_at: '',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const fetchProduct = async () => {
    const { data } = await supabase.from('products').select('*').eq('id', productId).single();
    if (data) {
      setForm({
        temu_url: data.temu_url || '', title: data.title || '', description: data.description || '',
        image_url: data.image_url || '', price: data.price?.toString() || '', category_id: data.category_id || '',
        tags: data.tags || [], slug: data.slug || '', status: data.status || 'draft',
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).toISOString().slice(0, 16) : '',
      });
      setCreatedAt(data.created_at);
      setUpdatedAt(data.updated_at);
    }
    setPageLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.temu_url) { alert('Title and Temu URL are required'); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: form.price ? parseFloat(form.price) : null, category_id: form.category_id || null, scheduled_at: form.scheduled_at || null }),
      });
      if (res.ok) router.push('/admin/products');
      else { const err = await res.json(); alert(err.error || 'Failed to update'); }
    } catch { alert('Failed to update'); }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', productId);
    router.push('/admin/products');
  };

  const addTag = () => { const tag = tagInput.trim(); if (tag && !form.tags.includes(tag)) { setForm(prev => ({ ...prev, tags: [...prev.tags, tag] })); setTagInput(''); } };
  const removeTag = (tag: string) => { setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) })); };

  if (pageLoading) return <div className="flex items-center justify-center h-96"><span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span></div>;

  return (
    <main className="p-8 lg:p-12 max-w-7xl">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <nav className="flex gap-2 text-xs font-medium text-outline mb-2">
            <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/admin/products')}>Products</span>
            <span>/</span>
            <span className="text-on-surface">Edit Product</span>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Edit Listing</h1>
          <div className="flex gap-4 mt-2 text-xs text-outline">
            <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/admin/products')} className="px-6 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Update Product
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 font-headline"><span className="material-symbols-outlined text-primary">edit_note</span> Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Temu URL</label>
                <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface font-medium text-sm" value={form.temu_url} onChange={(e) => setForm(prev => ({ ...prev, temu_url: e.target.value }))} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Product Title</label>
                <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface font-medium" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Description</label>
                <textarea className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface leading-relaxed" rows={4} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Image Preview</label>
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20">
                  {form.image_url ? <img className="w-full h-full object-cover" src={form.image_url} alt="Preview" /> : <div className="w-full h-full flex items-center justify-center text-outline"><span className="material-symbols-outlined text-4xl">image</span></div>}
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Image URL</label>
                  <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-sm" value={form.image_url} onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">$</span>
                    <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg pl-8 pr-4 py-3 font-bold text-xl" type="number" step="0.01" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-lg font-bold mb-6 font-headline">Organization</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Category</label>
                <select className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 font-medium" value={form.category_id} onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Tags</label>
                <div className="bg-surface-container-low rounded-lg p-3 flex flex-wrap gap-2 min-h-[80px] content-start">
                  {form.tags.map(tag => (
                    <span key={tag} className="bg-primary-container/30 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      {tag} <span className="material-symbols-outlined text-sm cursor-pointer" onClick={() => removeTag(tag)}>close</span>
                    </span>
                  ))}
                  <input className="bg-transparent border-none focus:ring-0 text-xs py-1 px-1 w-24" placeholder="Add tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}} />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-lg font-bold mb-6 font-headline">Publishing</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Status</label>
                <div className="space-y-2">
                  {(['draft', 'published', 'scheduled'] as const).map(s => (
                    <label key={s} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${form.status === s ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant/10 hover:bg-surface-container'}`}>
                      <input type="radio" name="status" className="text-primary focus:ring-primary" checked={form.status === s} onChange={() => setForm(prev => ({ ...prev, status: s }))} />
                      <span className={`text-sm font-semibold ${form.status === s ? 'text-primary' : ''}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Schedule Date</label>
                <input type="datetime-local" className={`w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-sm ${form.status !== 'scheduled' ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={form.status !== 'scheduled'} value={form.scheduled_at} onChange={(e) => setForm(prev => ({ ...prev, scheduled_at: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">URL Slug</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">/</span>
                  <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg pl-6 pr-4 py-3 text-sm font-mono" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} />
                </div>
              </div>
            </div>
          </section>

          <button onClick={handleDelete} className="w-full py-3 bg-error/10 text-error rounded-xl font-bold hover:bg-error/20 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">delete_forever</span>
            Delete Product
          </button>
        </div>
      </div>
    </main>
  );
}
