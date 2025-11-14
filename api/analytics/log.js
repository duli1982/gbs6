// Usage analytics ingest endpoint
// Accepts POST { name, data, ts } and logs to server logs.
// Extend later to persist to a database (e.g., Firestore) or a data warehouse.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { name, data, ts } = req.body || {};
    const event = { name: String(name || ''), data: data || {}, ts: ts || Date.now() };
    const meta = { ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '', ua: req.headers['user-agent'] || '' };
    // Minimal log; replace with persistence.
    console.log('[usage_event]', JSON.stringify({ event, meta }));
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

