import Link from 'next/link';

export const metadata = { title: 'About Us — Temu Deals', description: 'Learn about Temu Deals, your trusted source for curated Temu affiliate deals and products.' };

export default function AboutPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Temu Deals</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-8">About Us</h1>
        <div className="prose prose-sm max-w-none text-on-surface-variant space-y-5 text-[15px] leading-relaxed">
          <p>Welcome to <strong className="text-forest-900">Temu Deals</strong> — your trusted destination for curated deals from the Temu marketplace.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Our Mission</h2>
          <p>We believe everyone deserves access to quality products at unbeatable prices. Our team spends hours every day scouring the Temu marketplace to handpick the very best deals, so you don&apos;t have to spend your time searching through thousands of listings.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">What We Do</h2>
          <p>Every product on our site has been carefully reviewed and selected based on quality, value, customer reviews, and overall deal worthiness. We analyze price history, read through user reviews, and compare similar products to make sure we&apos;re only recommending the very best.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">How It Works</h2>
          <p>When you click on a product link, you&apos;ll be redirected to the Temu marketplace where you can complete your purchase. As an affiliate partner, we may earn a small commission on qualifying purchases — at no extra cost to you.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Our Promise</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Only genuinely good deals make it to our site</li>
            <li>We never promote products we wouldn&apos;t buy ourselves</li>
            <li>Transparent affiliate relationships — always</li>
            <li>Daily updates with fresh finds</li>
          </ul>
          <p>Got questions? Reach out to us on our <Link href="/contact" className="text-forest-700 underline underline-offset-2 hover:text-forest-900">Contact page</Link>.</p>
        </div>
      </main>
    </>
  );
}
