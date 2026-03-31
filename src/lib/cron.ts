import cron from 'node-cron';

let isInitialized = false;

export function initCron() {
  if (isInitialized) return;
  isInitialized = true;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cronSecret = process.env.CRON_SECRET || '';

  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const res = await fetch(`${siteUrl}/api/cron/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': cronSecret,
        },
      });
      const data = await res.json();
      console.log('[CRON] Auto-publish result:', data);
    } catch (error) {
      console.error('[CRON] Auto-publish error:', error);
    }
  });

  console.log('[CRON] Scheduler initialized - running every 5 minutes');
}
