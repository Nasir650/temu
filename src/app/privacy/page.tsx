import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — Temu Deals', description: 'Our privacy policy explains how we handle your data.' };

export default function PrivacyPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-forest-900">
        <nav className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
          <Link href="/" className="font-script text-3xl italic text-white tracking-wide">Temu Deals</Link>
          <Link href="/" className="text-cream-200 hover:text-white text-sm">← Back to Home</Link>
        </nav>
      </header>
      <main className="pt-24 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-forest-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-on-surface-variant mb-8">Last updated: March 2026</p>
        <div className="space-y-5 text-[15px] leading-relaxed text-on-surface-variant">
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Information We Collect</h2>
          <p>We collect minimal information to provide our service. This may include: browser type, device information, pages visited, and referring URLs through standard analytics tools. We do not collect personal information unless you voluntarily provide it (e.g., via email subscription).</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">How We Use Your Information</h2>
          <p>Any information collected is used solely to improve our service, analyze site traffic, and optimize the deal recommendations we provide. We never sell your personal information to third parties.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Cookies</h2>
          <p>We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and understand where visitors come from. See our <Link href="/cookies" className="text-forest-700 underline underline-offset-2">Cookie Policy</Link> for more details.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Affiliate Links</h2>
          <p>Our site contains affiliate links to Temu. When you click these links and make a purchase, we may receive a commission. Temu may use cookies to track these referrals. We encourage you to review Temu&apos;s own privacy policy for details on their data practices.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Third-Party Services</h2>
          <p>We may use third-party analytics services (such as Google Analytics) that collect, monitor, and analyze usage data. These services have their own privacy policies addressing how they use such information.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Your Rights</h2>
          <p>You have the right to access, correct, or delete any personal information we hold about you. Contact us at our <Link href="/contact" className="text-forest-700 underline underline-offset-2">Contact page</Link> to exercise these rights.</p>
          <h2 className="text-2xl font-headline font-bold text-forest-900 mt-8">Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.</p>
        </div>
      </main>
    </>
  );
}
