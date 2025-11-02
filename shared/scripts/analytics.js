// Lightweight client analytics helper
// Sends events to /api/analytics/log via fetch or sendBeacon

export async function trackEvent(name, data = {}) {
  const payload = { name, data, ts: Date.now() };
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      const ok = navigator.sendBeacon('/api/analytics/log', blob);
      if (ok) return;
    }
  } catch {}
  try {
    await fetch('/api/analytics/log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
  } catch {
    // ignore
  }
}

// Auto-track basic navigation
(function(){
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => trackEvent('page_view', { path: location.pathname }));
  } else {
    trackEvent('page_view', { path: location.pathname });
  }
})();

