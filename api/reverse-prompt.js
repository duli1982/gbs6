// Vercel Serverless Function: Reverse Prompt Generator via Google Gemini
// Expects POST JSON: { text, model? }
// Returns: { generated_prompt, reasoning, optimization_tips, examples, use_cases }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const { text = '', model: modelOverride } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }

    const model = (modelOverride || process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim();

    // Instruct Gemini to return strict JSON we can parse server-side
    const instruction = `You are an expert in prompt engineering and reverse-prompt analysis.
Analyze the provided text and infer the high-quality prompt that could have produced it.
Explain your reasoning, provide prompt optimization tips, and suggest practical examples and use cases.

Return ONLY strict minified JSON (no markdown, no backticks) with these keys:
{
  "generated_prompt": string, // a single, polished prompt ready to paste
  "reasoning": string,        // concise explanation of how you inferred it
  "optimization_tips": string[], // 4-7 specific improvements to strengthen the prompt
  "examples": string[],          // 3-5 brief, concrete prompt examples in similar style
  "use_cases": string[]          // 4-7 situations where this prompt is useful
}

Guidelines:
- Include a clear role (e.g., "Act as …"), task, context, audience, tone, and output format in generated_prompt when appropriate.
- Keep reasoning short but insightful.
- Use simple strings in the arrays (no nested objects).
- Do not include any text before or after the JSON.

Text to analyze:
---
${text}
---`;

    const payload = {
      contents: [
        { role: 'user', parts: [{ text: instruction }] },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'Gemini API error', details: text });
    }

    const data = await resp.json();
    let textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!textOut) {
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }

    // Strip potential code fences and parse JSON safely
    textOut = textOut.replace(/```json|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(textOut);
    } catch (e) {
      return res.status(502).json({ error: 'Invalid JSON from Gemini', raw: textOut });
    }

    const {
      generated_prompt = '',
      reasoning = '',
      optimization_tips = [],
      examples = [],
      use_cases = [],
    } = parsed || {};

    return res.status(200).json({ generated_prompt, reasoning, optimization_tips, examples, use_cases });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}

