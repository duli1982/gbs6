// Vercel Serverless Function: Generate an improved "Gem" prompt via Google Gemini
// Expects POST JSON: { persona, task, context, audience, tone, format, seed }
// Returns: { gem: string }

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
    const {
      persona = '',
      task = '',
      context = '',
      audience = '',
      tone = '',
      format = '',
      seed = '',
      model: modelOverride,
    } = req.body || {};

    // Model selection: default to gemini-2.0-flash-exp, allow override via env or request
    const model = (modelOverride || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp').trim();

    // Build a structured instruction for Gemini to craft a CREATE-style, ready-to-use prompt (the "Gem")
    const instruction = `You are an expert prompt engineer for Google Gemini.
Craft a single, polished prompt (a \"Gem\") using the CREATE framework internally, but OUTPUT a clean, unified prompt WITHOUT any section labels (no Title/C/R/E/A/T/E labels). The result must be copy-ready, concise, and clearly structured so a user immediately sees value yet can edit easily.

Desired shape of the final text (no labels):
- Begin with a short, task-focused title line.
- Immediately follow with an instruction paragraph that includes the role (\"Act as...\"), context, and the core task.
- Provide 3–6 numbered constraints/steps (expectations) as a single list.
- Include a single sentence clarifying the intended audience.
- Include one concise sentence for tone/style.
- End with an explicit Output Format block (Markdown section list or a fenced code block with schema) so responses are consistent.

Rules:
- DO NOT include any explicit section labels like \"Title\", \"C — Context\", etc.
- Be directive and specific; avoid filler.
- Keep the total length focused; only expand if the Output Format needs it.
- If some fields are missing, infer sensible defaults without inventing domain-specific facts.
- If seed text is provided, harmonize phrasing and terminology with it.
- Return ONLY the final prompt text (no commentary).

Fields:
Persona: ${persona}
Task: ${task}
Context: ${context}
Audience: ${audience}
Tone: ${tone}
Format: ${format}

Seed prompt (optional): ${seed}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: instruction }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 400,
      },
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s safety timeout
    const resp = await fetch(
      endpoint,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'Gemini API error', details: text });
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }

    return res.status(200).json({ gem: text });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}
