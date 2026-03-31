'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    // Get product counts
    const cats: Category[] = [];
    for (const cat of data || []) {
      const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('category_id', cat.id);
      cats.push({ ...cat, product_count: count || 0 });
    }
    setCategories(cats);
    setLoading(false);
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const addCategory = async () => {
    if (!newName.trim()) return;
    const slug = generateSlug(newName);
    await supabase.from('categories').insert({ name: newName.trim(), slug });
    setNewName('');
    fetchCategories();
  };

  const updateCategory = async () => {
    if (!editName.trim() || !editId) return;
    const slug = generateSlug(editName);
    await supabase.from('categories').update({ name: editName.trim(), slug }).eq('id', editId);
    setEditId(null);
    setEditName('');
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Products will be uncategorized.')) return;
    await supabase.from('products').update({ category_id: null }).eq('category_id', id);
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  return (
    <>
      <header className="h-24 px-8 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-slate-900/5">
        <div>
          <h2 className="text-2xl font-black text-primary font-headline tracking-tight">Categories</h2>
          <p className="text-sm text-on-surface-variant">Organize your product catalog.</p>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Add Category */}
        <div className="flex gap-4">
          <input className="flex-1 max-w-md bg-surface-container-lowest border-none ring-1 ring-outline-variant/20 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary" placeholder="New category name..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); }} />
          <button onClick={addCategory} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-headline font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">add_circle</span> Add Category
          </button>
        </div>

        {/* Categories Table */}
        <section className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-outline">Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-outline">Products</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-outline text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-16"><span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span></td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-16 text-on-surface-variant">No categories yet.</td></tr>
                ) : categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-4">
                      {editId === cat.id ? (
                        <input className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg px-3 py-2 text-sm font-bold" value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') updateCategory(); }} autoFocus />
                      ) : (
                        <span className="font-bold text-sm">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">/{cat.slug}</td>
                    <td className="px-6 py-4"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">{cat.product_count}</span></td>
                    <td className="px-8 py-4 text-right whitespace-nowrap">
                      {editId === cat.id ? (
                        <>
                          <button onClick={updateCategory} className="px-3 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-lg text-xs font-bold mr-2">Save</button>
                          <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-outline-variant/20 text-on-surface-variant rounded-lg text-xs font-bold">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                          <button onClick={() => deleteCategory(cat.id)} className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                        </>
                      )}
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
