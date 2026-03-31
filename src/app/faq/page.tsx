import Link from 'next/link';

export const metadata = { title: 'FAQ — Temu Deals', description: 'Frequently asked questions about Temu Deals.' };

const faqs = [
  { q: 'What is Temu Deals?', a: 'Temu Deals is an affiliate website that curates the best deals from the Temu marketplace. Our team handpicks quality products at unbeatable prices so you can shop smarter.' },
  { q: 'How do you select products?', a: 'Our team reviews products based on price, quality, customer ratings, order volume, and overall value. Only the best deals make it to our site.' },
  { q: 'Do I buy products from you?', a: 'No. When you click on a deal, you are redirected to the Temu marketplace where you complete your purchase directly with Temu.' },
  { q: 'Are the prices accurate?', a: 'We update prices regularly, but prices on Temu can change at any time. The final price will always be shown on Temu\'s website at checkout.' },
  { q: 'Do you charge extra for using your links?', a: 'Absolutely not. The price you pay is exactly the same whether you use our link or go directly to Temu. We earn a small commission from Temu at no cost to you.' },
  { q: 'How often are new deals added?', a: 'We add new deals daily! Our team is constantly searching for the best products and updating our listings.' },
  { q: 'Can I suggest a product?', a: 'Yes! We love hearing from our community. Visit our Contact page to suggest products you\'d like us to review and feature.' },
  { q: 'Is Temu safe to buy from?', a: 'Temu is a legitimate and popular online marketplace. They offer buyer protection and easy returns. However, as with any online shopping, we recommend reading product reviews before purchasing.' },
];

export default function FAQPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Temu Deals</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-on-surface-variant mb-10">Everything you need to know about Temu Deals.</p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
              <h2 className="text-base font-bold text-forest-900 mb-2">{faq.q}</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-cream-200/40 rounded-2xl p-8 text-center">
          <p className="text-forest-900 font-semibold mb-2">Still have questions?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white text-sm font-semibold rounded-full hover:bg-forest-700 transition-all">Contact Us</Link>
        </div>
      </main>
    </>
  );
}
