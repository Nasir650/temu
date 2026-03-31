'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ClickByProduct { slug: string; clicks: number; }
interface ClickByDate { date: string; clicks: number; }

export default function AdminAnalytics() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [byProduct, setByProduct] = useState<ClickByProduct[]>([]);
  const [byDate, setByDate] = useState<ClickByDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      // Total clicks
      const { count } = await supabase.from('utm_clicks').select('id', { count: 'exact', head: true });
      setTotalClicks(count || 0);

      // Clicks by product
      const { data: clicks } = await supabase.from('utm_clicks').select('product_slug');
      const productMap: Record<string, number> = {};
      (clicks || []).forEach(c => { productMap[c.product_slug] = (productMap[c.product_slug] || 0) + 1; });
      const sorted = Object.entries(productMap).map(([slug, clicks]) => ({ slug, clicks })).sort((a, b) => b.clicks - a.clicks).slice(0, 20);
      setByProduct(sorted);

      // Clicks by date (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data: dateClicks } = await supabase.from('utm_clicks').select('clicked_at').gte('clicked_at', thirtyDaysAgo.toISOString());
      const dateMap: Record<string, number> = {};
      // Fill all 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dateMap[d.toISOString().split('T')[0]] = 0;
      }
      (dateClicks || []).forEach(c => {
        const day = new Date(c.clicked_at).toISOString().split('T')[0];
        if (dateMap[day] !== undefined) dateMap[day]++;
      });
      setByDate(Object.entries(dateMap).map(([date, clicks]) => ({ date, clicks })));
    } catch (err) {
      console.error('Analytics error:', err);
    }
    setLoading(false);
  };

  return (
    <>
      <header className="h-24 px-8 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-slate-900/5">
        <div>
          <h2 className="text-2xl font-black text-primary font-headline tracking-tight">Analytics</h2>
          <p className="text-sm text-on-surface-variant">Click tracking and performance insights.</p>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Total Clicks Card */}
        <div className="p-8 bg-primary text-white rounded-3xl shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <span className="material-symbols-outlined" style={{ fontSize: '160px' }}>ads_click</span>
          </div>
          <div className="relative z-10">
            <p className="text-white/70 font-medium text-xs uppercase tracking-wider">Total Affiliate Clicks — All Time</p>
            <h3 className="text-5xl font-black font-headline mt-2">{loading ? '...' : totalClicks.toLocaleString()}</h3>
          </div>
        </div>

        {/* Clicks Over Time */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold font-headline mb-6">Clicks Over Time (Last 30 Days)</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center"><span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span></div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c5c5d4" strokeOpacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#757684' }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                  <YAxis tick={{ fontSize: 10, fill: '#757684' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'Inter' }} />
                  <Line type="monotone" dataKey="clicks" stroke="#24389c" strokeWidth={2.5} dot={{ fill: '#24389c', r: 3 }} activeDot={{ r: 6, fill: '#3f51b5' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Top Products */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold font-headline mb-6">Top Products by Clicks</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center"><span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span></div>
          ) : byProduct.length === 0 ? (
            <p className="text-center text-on-surface-variant py-12">No click data yet.</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byProduct} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c5c5d4" strokeOpacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#757684' }} />
                  <YAxis dataKey="slug" type="category" tick={{ fontSize: 11, fill: '#454652' }} width={120} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="clicks" fill="#3f51b5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
