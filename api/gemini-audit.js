// Vercel Serverless Function: Gemini API for AI Skills Audit Enhancement
// Expects POST JSON: { prompt, temperature, maxTokens }
// Returns: { text: string, response: string }

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const {
      prompt = '',
      temperature = 0.7,
      maxTokens = 2000,
      model: modelOverride,
    } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Model selection: default to gemini-2.0-flash-exp
    const model = (modelOverride || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp').trim();

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: maxTokens,
      },
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout for longer audit analysis

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Gemini API error:', text);
      return res.status(resp.status).json({ error: 'Gemini API error', details: text });
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }

    // Return in format expected by gemini-enhancer.js
    return res.status(200).json({ text: text, response: text });

  } catch (err) {
    console.error('Gemini audit error:', err);
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}
