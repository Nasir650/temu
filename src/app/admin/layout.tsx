'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const navItems = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/products', icon: 'shopping_bag', label: 'Products' },
  { href: '/admin/queue', icon: 'schedule', label: 'Queue' },
  { href: '/admin/categories', icon: 'category', label: 'Categories' },
  { href: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
  { href: '/admin/bookmarklet', icon: 'bookmark', label: 'Bookmarklet' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('Admin');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && pathname !== '/admin/login') {
          router.push('/admin/login');
          return;
        }
        if (session) {
          setUserEmail(session.user.email || 'Admin');
        }
      } catch {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
          return;
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
          <p className="text-on-surface-variant text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`h-screen w-64 fixed left-0 top-0 bg-slate-100 flex flex-col p-4 z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-primary tracking-tight font-headline">Spy Web Cams Manager</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-primary hover:bg-white/50'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-primary hover:bg-white/50 transition-colors font-headline font-semibold text-sm rounded-lg mb-1"
          >
            <span className="material-symbols-outlined">visibility</span>
            View Store
          </Link>

          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <div>
              <p className="text-sm font-bold truncate max-w-[140px]">{userEmail}</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary-container text-white rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-secondary-container/20"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-4 p-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-primary">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-lg font-black text-primary font-headline">Spy Web Cams Manager</h1>
        </div>

        {children}
      </main>
    </div>
  );
}
