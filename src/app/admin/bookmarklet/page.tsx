'use client';

import { useState } from 'react';

export default function AdminBookmarklet() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const bookmarkletCode = `javascript:(function(){if(!window.location.href.includes('temu.com')){alert('This bookmarklet only works on Temu product pages.');return;}var t=document.querySelector('h1')?.innerText||document.querySelector('[class*="title"]')?.innerText||document.title;t=t?.trim()||'';var p=document.querySelector('[class*="price"]')?.innerText||document.querySelector('[class*="Price"]')?.innerText||null;if(p)p=p.replace(/[^0-9.]/g,'');var i=document.querySelector('img[class*="main"]')?.src||document.querySelector('img[class*="product"]')?.src||document.querySelector('img')?.src||null;var u=window.location.href;var d=document.createElement('div');d.id='temu-toast';d.style.cssText='position:fixed;bottom:24px;right:24px;z-index:999999;padding:16px 24px;border-radius:16px;font-family:Inter,sans-serif;font-size:14px;font-weight:600;color:white;background:linear-gradient(135deg,#24389c,#3f51b5);box-shadow:0 8px 32px rgba(36,56,156,0.3);display:flex;align-items:center;gap:12px;';d.innerHTML='<div style="width:20px;height:20px;border:2px solid white;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></div>Saving to Temu Store...';var s=document.createElement('style');s.textContent='@keyframes spin{to{transform:rotate(360deg)}}';document.head.appendChild(s);document.body.appendChild(d);fetch('${siteUrl}/api/ingest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:t,price:p,image_url:i,temu_url:u,source:'bookmarklet',bookmarklet_secret:'temu_bkm_J5hT2nQ8xW6yP4mK'})}).then(function(r){return r.json().then(function(j){if(r.ok){d.style.background='linear-gradient(135deg,#006846,#004e33)';d.innerHTML='<span style="font-size:20px">✓</span> Saved as draft! Open admin to review.';setTimeout(function(){d.remove()},3000);}else{d.style.background='linear-gradient(135deg,#ba1a1a,#93000a)';d.innerHTML='<span style="font-size:20px">✕</span> Error: '+(j.error||'Unknown error');setTimeout(function(){d.remove()},4000);}});}).catch(function(){d.style.background='linear-gradient(135deg,#b02f00,#862200)';d.innerHTML='<span style="font-size:20px">⚠</span> Network error. Are you online?';setTimeout(function(){d.remove()},4000);});})();`;

  const copyCode = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testAPI = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Product from Bookmarklet',
          price: '9.99',
          image_url: 'https://via.placeholder.com/300',
          temu_url: 'https://www.temu.com/test-product.html',
          source: 'bookmarklet',
          bookmarklet_secret: 'temu_bkm_J5hT2nQ8xW6yP4mK',
        }),
      });
      const data = await res.json();
      setTestResult(res.ok ? `✅ Success! Product saved with slug: ${data.slug}` : `❌ Error: ${data.error}`);
    } catch {
      setTestResult('❌ Network/server error');
    }
    setTestLoading(false);
  };

  return (
    <>
      <header className="h-24 px-8 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-slate-900/5">
        <div>
          <h2 className="text-2xl font-black text-primary font-headline tracking-tight">Bookmarklet</h2>
          <p className="text-sm text-on-surface-variant">Quick-save products from Temu with one click.</p>
        </div>
      </header>

      <div className="p-8 max-w-4xl space-y-8">
        {/* Instructions */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
          <h3 className="text-xl font-bold font-headline mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            How to Install the Bookmarklet
          </h3>
          <div className="space-y-4">
            {[
              { step: 1, text: 'Make sure you are logged into your admin panel in this browser.' },
              { step: 2, text: 'Drag the button below to your browser bookmarks bar.' },
              { step: 3, text: 'Go to any Temu product page.' },
              { step: 4, text: 'Click the bookmarklet in your bookmarks bar.' },
              { step: 5, text: 'The product is instantly saved as a draft in your admin queue.' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black shrink-0">{step}</span>
                <p className="text-sm text-on-surface leading-relaxed pt-1">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Drag Button */}
        <section className="bg-surface-container-low rounded-3xl p-8">
          <h3 className="text-lg font-bold font-headline mb-4">Drag to Bookmarks Bar</h3>
          <div className="flex flex-col items-center gap-6">
            <a
              href={bookmarkletCode}
              onClick={(e) => e.preventDefault()}
              draggable
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 cursor-grab active:cursor-grabbing"
            >
              <span className="material-symbols-outlined">bookmark_add</span>
              Save to Temu Store
            </a>
            <p className="text-xs text-outline text-center">↑ Drag this button to your bookmarks bar. Do not click it here.</p>
          </div>
        </section>

        {/* Copy Code */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
          <h3 className="text-lg font-bold font-headline mb-4">Copy Bookmarklet Code</h3>
          <div className="bg-surface-container-low rounded-xl p-4 mb-4 overflow-x-auto">
            <code className="text-xs text-primary font-mono break-all">{bookmarkletCode.substring(0, 200)}...</code>
          </div>
          <button onClick={copyCode} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
            {copied ? 'Copied!' : 'Copy Bookmarklet Code'}
          </button>
        </section>

        {/* Test Section */}
        <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
          <h3 className="text-lg font-bold font-headline mb-4">Test Bookmarklet API</h3>
          <p className="text-sm text-on-surface-variant mb-4">Send a test POST to verify the ingest endpoint is working.</p>
          <button onClick={testAPI} disabled={testLoading} className="px-6 py-3 bg-secondary-container text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
            {testLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <span className="material-symbols-outlined">science</span>}
            Test Bookmarklet API
          </button>
          {testResult && (
            <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${testResult.startsWith('✅') ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error-container text-on-error-container'}`}>
              {testResult}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
