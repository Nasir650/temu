import Link from 'next/link';

export const metadata = { title: 'Cookie Policy — Spy Web Cams', description: 'How Spy Web Cams uses cookies on our website.' };

export default function CookiePolicyPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Spy Web Cams</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-on-surface-variant mb-8">Last updated: March 2026</p>
        <div className="space-y-5 text-[15px] leading-relaxed text-on-surface-variant">
          <p>This Cookie Policy explains how Spy Web Cams uses cookies and similar technologies when you visit our website.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Types of Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-forest-900">Essential Cookies:</strong> Required for the website to function properly.</li>
            <li><strong className="text-forest-900">Analytics Cookies:</strong> Help us understand how visitors use our site so we can improve it.</li>
            <li><strong className="text-forest-900">Affiliate Cookies:</strong> Used by our affiliate partners (Temu) to track referrals and attribute purchases.</li>
          </ul>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Managing Cookies</h2>
          <p>You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website and our ability to earn affiliate commissions through your purchases.</p>
        </div>
      </main>
    </>
  );
}
