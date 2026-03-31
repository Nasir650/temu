import Link from 'next/link';

export const metadata = { title: 'Contact Us — Temu Deals', description: 'Get in touch with the Temu Deals team.' };

export default function ContactPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Temu Deals</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-4">Contact Us</h1>
        <p className="text-on-surface-variant mb-10">Have a question, suggestion, or business inquiry? We&apos;d love to hear from you.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200">
            <h2 className="text-xl font-headline font-bold text-forest-900 mb-4">Send a Message</h2>
            <form className="space-y-4">
              <div><label className="block text-sm font-medium text-forest-900 mb-1">Name</label><input className="w-full h-11 px-4 rounded-xl bg-cream-100 border border-cream-300 text-sm outline-none focus:ring-2 focus:ring-forest-500/30" placeholder="Your name" /></div>
              <div><label className="block text-sm font-medium text-forest-900 mb-1">Email</label><input type="email" className="w-full h-11 px-4 rounded-xl bg-cream-100 border border-cream-300 text-sm outline-none focus:ring-2 focus:ring-forest-500/30" placeholder="your@email.com" /></div>
              <div><label className="block text-sm font-medium text-forest-900 mb-1">Message</label><textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-cream-100 border border-cream-300 text-sm outline-none focus:ring-2 focus:ring-forest-500/30 resize-none" placeholder="Your message..."></textarea></div>
              <button type="submit" className="w-full h-11 bg-forest-900 text-white font-semibold text-sm rounded-xl hover:bg-forest-700 transition-colors">Send Message</button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-cream-200/40 rounded-2xl p-6">
              <h3 className="font-bold text-forest-900 mb-2">💡 Deal Suggestions</h3>
              <p className="text-sm text-on-surface-variant">Found an amazing Temu deal you think we should feature? Let us know and we&apos;ll review it!</p>
            </div>
            <div className="bg-cream-200/40 rounded-2xl p-6">
              <h3 className="font-bold text-forest-900 mb-2">🤝 Business Inquiries</h3>
              <p className="text-sm text-on-surface-variant">Interested in partnerships or collaborations? Reach out and we&apos;ll get back to you within 24 hours.</p>
            </div>
            <div className="bg-cream-200/40 rounded-2xl p-6">
              <h3 className="font-bold text-forest-900 mb-2">🐛 Report an Issue</h3>
              <p className="text-sm text-on-surface-variant">Found a broken link or incorrect product information? Please let us know so we can fix it.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
