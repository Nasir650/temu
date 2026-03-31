import Link from 'next/link';

export const metadata = { title: 'Terms of Service — Temu Deals', description: 'Terms and conditions for using Temu Deals.' };

export default function TermsPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Temu Deals</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-on-surface-variant mb-8">Last updated: March 2026</p>
        <div className="space-y-5 text-[15px] leading-relaxed text-on-surface-variant">
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Acceptance of Terms</h2>
          <p>By accessing and using Temu Deals, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Nature of Our Service</h2>
          <p>Temu Deals is an affiliate marketing website. We curate and showcase deals from the Temu marketplace. We do not sell products directly. When you click on a product link, you will be redirected to Temu&apos;s website where you can complete your purchase.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Product Information</h2>
          <p>While we strive to provide accurate product information, prices and availability are subject to change. The final price and product details will be shown on Temu&apos;s website at the time of purchase. We are not responsible for discrepancies between our listings and the merchant site.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Affiliate Relationships</h2>
          <p>We participate in affiliate programs which means we may earn commissions on purchases made through our links. This does not affect the price you pay. See our <Link href="/affiliate-disclosure" className="text-forest-700 underline underline-offset-2">Affiliate Disclosure</Link> for full details.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Limitation of Liability</h2>
          <p>Temu Deals is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of this website or purchases made through our affiliate links. All transactions are between you and the merchant.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Contact</h2>
          <p>If you have questions about these terms, please visit our <Link href="/contact" className="text-forest-700 underline underline-offset-2">Contact page</Link>.</p>
        </div>
      </main>
    </>
  );
}
