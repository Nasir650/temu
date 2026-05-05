import Link from 'next/link';

export const metadata = { title: 'How It Works — Spy Web Cams', description: 'Learn how Spy Web Cams works and start saving today.' };

export default function HowItWorksPage() {
  const steps = [
    { icon: '🔍', title: 'We Curate', desc: 'Our team searches through thousands of Temu listings daily, analyzing prices, reviews, and quality to find genuine deals worth your time.' },
    { icon: '⭐', title: 'We Review', desc: 'Every product goes through our vetting process. We check customer ratings, order history, return rates, and price trends to ensure value.' },
    { icon: '📋', title: 'We List', desc: 'Only the best deals make it to our site. We organize them by category with clear pricing so you can quickly find what you need.' },
    { icon: '🛒', title: 'You Shop', desc: 'Click on any deal and you\'ll be taken directly to Temu\'s marketplace where you can purchase at the listed price. Simple as that!' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Spy Web Cams</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-4">How It Works</h1>
        <p className="text-on-surface-variant mb-12">Getting the best Spy Web Cams deals is as easy as 1-2-3-4.</p>
        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center text-3xl">{step.icon}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-forest-600 bg-forest-100 px-2.5 py-0.5 rounded-full">Step {i + 1}</span>
                  <h2 className="text-xl font-bold text-forest-900">{step.title}</h2>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-gradient-to-br from-forest-900 to-forest-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-headline font-bold text-white mb-3">Ready to Start Saving?</h2>
          <p className="text-cream-300 text-sm mb-6">Browse today&apos;s curated deals and find your next great purchase.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-forest-950 text-sm font-bold rounded-full hover:bg-amber-400 transition-all">Shop All Deals</Link>
        </div>
      </main>
    </>
  );
}
