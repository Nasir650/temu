'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageHint, setImageHint] = useState('');

  const [form, setForm] = useState({
    temu_url: '',
    title: '',
    description: '',
    image_url: '',
    price: '',
    category_id: '',
    tags: [] as string[],
    slug: '',
    status: 'draft' as 'draft' | 'scheduled' | 'published',
    scheduled_at: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [affiliatePreview, setAffiliatePreview] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (form.temu_url && form.slug) {
      const separator = form.temu_url.includes('?') ? '&' : '?';
      setAffiliatePreview(`${form.temu_url}${separator}utm_source=yoursite&utm_medium=affiliate&utm_campaign=temu&utm_content=${form.slug}`);
    }
  }, [form.temu_url, form.slug]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
  };

  const fetchOG = async () => {
    if (!form.temu_url) return;
    setFetching(true);
    try {
      const res = await fetch('/api/og-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.temu_url }),
      });
      const data = await res.json();
      const slug = generateSlug(data.title || form.title);
      setForm(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        image_url: data.image || prev.image_url,
        slug: slug || prev.slug,
      }));
      if (data.imageHint) {
        setImageHint(data.imageHint);
      } else {
        setImageHint('');
      }
    } catch (err) {
      console.error('OG fetch failed:', err);
    }
    setFetching(false);
  };

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title);
    setForm(prev => ({ ...prev, title, slug }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    const slug = generateSlug(newCategoryName);
    const { data } = await supabase.from('categories').insert({ name: newCategoryName.trim(), slug }).select().single();
    if (data) {
      setCategories(prev => [...prev, data]);
      setForm(prev => ({ ...prev, category_id: data.id }));
    }
    setNewCategoryName('');
    setShowCategoryModal(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.temu_url) {
      alert('Title and Temu URL are required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: form.price ? parseFloat(form.price) : null,
          category_id: form.category_id || null,
          scheduled_at: form.scheduled_at || null,
        }),
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create product');
      }
    } catch {
      alert('Failed to create product');
    }
    setLoading(false);
  };

  return (
    <>
      <main className="p-8 lg:p-12 max-w-7xl">
        {/* Header */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <nav className="flex gap-2 text-xs font-medium text-outline mb-2">
              <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/admin/products')}>Products</span>
              <span>/</span>
              <span className="text-on-surface">Add New Product</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Create Listing</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/admin/products')} className="px-6 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container transition-colors">Discard</button>
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              Save Product
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Ingestion Section */}
          <section className="col-span-12 bg-surface-container-low rounded-3xl p-8 transition-all hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-white">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline">Product Ingestion</h3>
                <p className="text-sm text-outline">Import product data directly from Temu</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  className="w-full bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 focus:ring-2 focus:ring-primary rounded-xl px-4 py-4 text-on-surface font-medium"
                  placeholder="https://www.temu.com/goods-..."
                  value={form.temu_url}
                  onChange={(e) => setForm(prev => ({ ...prev, temu_url: e.target.value }))}
                  onBlur={fetchOG}
                />
                {fetching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-primary font-medium">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-xs">Fetching...</span>
                  </div>
                )}
              </div>
              <button onClick={fetchOG} disabled={fetching} className="bg-primary text-on-primary px-8 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-colors group">
                Fetch Details
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Metadata Preview */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                Metadata Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Product Title</label>
                  <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface font-medium" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Description</label>
                  <textarea className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface leading-relaxed" rows={4} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Thumbnail Preview</label>
                  <div className="relative group aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20">
                    {form.image_url ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={form.image_url} alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-outline p-4 text-center">
                        <span className="material-symbols-outlined text-4xl mb-3">image</span>
                        {imageHint ? (
                          <>
                            <p className="text-xs font-bold text-secondary mb-1">Image not auto-fetched</p>
                            <p className="text-[11px] text-outline leading-relaxed">Go to the Temu page → right-click the product image → Copy image address → paste below</p>
                          </>
                        ) : (
                          <p className="text-xs">Paste image URL below</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-outline">Image URL</label>
                    <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface text-sm truncate" value={form.image_url} onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-outline">Sale Price ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">$</span>
                      <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg pl-8 pr-4 py-3 text-on-surface font-bold text-xl" type="number" step="0.01" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Affiliate Preview */}
            <section className="bg-surface-container-low rounded-3xl p-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined text-secondary">share</span>
                Affiliate Tracking
              </h3>
              <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 flex items-center gap-4">
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] text-outline uppercase font-black tracking-widest mb-1">Generated URL</p>
                  <code className="text-sm text-primary font-mono truncate block">{affiliatePreview || 'Enter a Temu URL and slug to preview'}</code>
                </div>
                <button onClick={() => navigator.clipboard.writeText(affiliatePreview)} className="p-3 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">content_copy</span>
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Controls */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Organization */}
            <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
              <h3 className="text-lg font-bold mb-6 font-headline">Organization</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-outline">Category</label>
                    <button onClick={() => setShowCategoryModal(true)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                      <span className="material-symbols-outlined text-sm">add_circle</span> Add New
                    </button>
                  </div>
                  <select className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface font-medium" value={form.category_id} onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}>
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Tags</label>
                  <div className="w-full bg-surface-container-low rounded-lg p-3 flex flex-wrap gap-2 min-h-[100px] content-start">
                    {form.tags.map(tag => (
                      <span key={tag} className="bg-primary-container/30 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        {tag} <span className="material-symbols-outlined text-sm cursor-pointer" onClick={() => removeTag(tag)}>close</span>
                      </span>
                    ))}
                    <input className="bg-transparent border-none focus:ring-0 text-xs font-medium py-1 px-1 w-24" placeholder="Add tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}} />
                  </div>
                </div>
              </div>
            </section>

            {/* Publishing */}
            <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
              <h3 className="text-lg font-bold mb-6 font-headline">Publishing</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Status</label>
                  <div className="space-y-2">
                    {(['draft', 'published', 'scheduled'] as const).map(s => (
                      <label key={s} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${form.status === s ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant/10 hover:bg-surface-container'}`}>
                        <input type="radio" name="status" className="text-primary focus:ring-primary" checked={form.status === s} onChange={() => setForm(prev => ({ ...prev, status: s }))} />
                        <span className={`text-sm font-semibold ${form.status === s ? 'text-primary font-bold' : ''}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">Schedule Date</label>
                  <input type="datetime-local" className={`w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface text-sm ${form.status !== 'scheduled' ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={form.status !== 'scheduled'} value={form.scheduled_at} onChange={(e) => setForm(prev => ({ ...prev, scheduled_at: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-outline">URL Slug</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">/</span>
                    <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg pl-6 pr-12 py-3 text-on-surface text-sm font-mono" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} />
                    <button onClick={() => handleTitleChange(form.title)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                      <span className="material-symbols-outlined text-lg">autorenew</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SEO Tip */}
            <div className="bg-secondary-container/10 p-6 rounded-3xl border-l-4 border-secondary">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <div>
                  <p className="text-sm font-bold text-on-secondary-container">SEO Tip</p>
                  <p className="text-xs text-secondary leading-relaxed mt-1">Short, descriptive slugs perform 20% better in affiliate conversion tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-headline mb-4">Add New Category</h3>
            <input className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-on-surface mb-4" placeholder="Category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); }} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCategoryModal(false)} className="px-4 py-2 rounded-lg text-on-surface-variant font-semibold">Cancel</button>
              <button onClick={addCategory} className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold">Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
