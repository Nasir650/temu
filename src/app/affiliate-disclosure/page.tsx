import Link from 'next/link';

export const metadata = { title: 'Affiliate Disclosure — Spy Web Cams', description: 'Full affiliate disclosure for Spy Web Cams.' };

export default function AffiliateDisclosurePage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Spy Web Cams</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-2">Affiliate Disclosure</h1>
        <p className="text-sm text-on-surface-variant mb-8">Last updated: March 2026</p>
        <div className="space-y-5 text-[15px] leading-relaxed text-on-surface-variant">
          <div className="bg-cream-200/50 rounded-2xl p-6 border border-cream-300">
            <p className="font-semibold text-forest-900">In the interest of full transparency: This website contains affiliate links. When you click on a product and make a purchase on Temu, we may receive a small commission at no additional cost to you.</p>
          </div>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">What Are Affiliate Links?</h2>
          <p>Affiliate links are special URLs that track referrals from our site to the Temu marketplace. When you click on one of our product links and make a purchase, Temu tracks that the referral came from us and pays us a small commission.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Does This Cost You Extra?</h2>
          <p><strong className="text-forest-900">Absolutely not.</strong> The price you pay is exactly the same whether you use our affiliate link or go directly to Temu. Our commission comes from Temu&apos;s marketing budget, not from your pocket.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Why We Use Affiliate Links</h2>
          <p>Affiliate commissions are what allow us to operate this website, pay for hosting, and dedicate time to curating the best deals for you. Without this revenue, we would not be able to provide this free service.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Our Editorial Integrity</h2>
          <p>Our deal recommendations are based purely on product quality, value, and customer reviews. We never accept payment from merchants to feature specific products, and we never promote products we don&apos;t genuinely believe offer great value.</p>
        </div>
      </main>
    </>
  );
}
