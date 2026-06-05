// Vercel Serverless Function: Run a fixed, multi-skill workflow over a single input.
//
// v1 use case — "Smart JD Intake": the user pastes a job description and gets back,
// in one shot, the output of a fixed chain of skills:
//   1) Job Description Clarification   (hiring-manager-alignment-architect)
//   2) Intake Call Preparation         (hiring-manager-alignment-architect)
//   3) Sourcing Angles                 (hiring-strategist-pro)
//
// Each step loads its skill's executable prompt from skill-prompts.generated.js
// (generated from gbs-prompts/gems.json) and runs it on the user's input.
//
// Expects POST JSON: { input: string, workflow?: string }
// Returns: { workflow, steps: [{ key, label, skillId, skillTitle, risk, output }] }
//
// Security mirrors api/generate-gem.js: origin allow-list, per-IP rate limiting,
// model fallback with cooldown on 429.

import { SKILL_PROMPTS, SKILL_CATALOG } from './skill-prompts.generated.js';

// ---- Workflow definitions --------------------------------------------------
// To add a workflow or change a chain, edit here. Each step names a skill id
// (must exist in SKILL_PROMPTS) and a focus directive that narrows that skill's
// output to this step's purpose.
const WORKFLOWS = {
  'jd-intake': {
    label: 'Smart JD Intake',
    inputLabel: 'Job description',
    steps: [
      {
        key: 'clarification',
        label: 'Job Description Clarification',
        skillId: 'hiring-manager-alignment-architect',
        focus:
          'Focus ONLY on clarifying the role from the job description below. ' +
          'Separate must-haves from nice-to-haves, flag vague/unrealistic/contradictory ' +
          'requirements, and list the open questions that must be resolved before sourcing. ' +
          'Do not write an intake agenda or a sourcing plan here.',
      },
      {
        key: 'intake-prep',
        label: 'Intake Call Preparation',
        skillId: 'hiring-manager-alignment-architect',
        focus:
          'Focus ONLY on preparing the recruiter for the intake call with the hiring manager. ' +
          'Produce a short agenda and the exact, practical questions to ask to align on ' +
          'must-haves, trade-offs, process, and success criteria. Do not repeat the full ' +
          'clarification analysis or write a sourcing plan here.',
      },
      {
        key: 'sourcing',
        label: 'Sourcing Angles',
        skillId: 'hiring-strategist-pro',
        focus:
          'Focus ONLY on where and how to find candidates for this role. Produce target ' +
          'personas, likely talent pools, target companies/industries, channel mix, and ' +
          'concrete sourcing angles a recruiter can act on today.',
      },
    ],
  },
};

// ---- Config (aligned with api/generate-gem.js) -----------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
// Phased runs make several requests each (1 route + up to 3 run). Allow a few full
// runs per minute while still limiting abuse.
const RATE_LIMIT_MAX = 20;
const rateLimit = new Map();
const modelCooldownUntil = new Map();
const MAX_INPUT_LENGTH = 8000;

function parseList(value) {
  if (!value || typeof value !== 'string') return [];
  return value.split(',').map((x) => x.trim()).filter(Boolean);
}

function getRequestOrigin(req) {
  const origin = req.headers?.origin ? String(req.headers.origin) : '';
  if (origin) return origin;
  const referer = req.headers?.referer ? String(req.headers.referer) : '';
  if (!referer) return '';
  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
}

function isAllowedOrigin(req) {
  const origin = getRequestOrigin(req);
  if (!origin) return false;
  const allowedOrigins = parseList(process.env.ALLOWED_ORIGINS);
  if (allowedOrigins.length) return allowedOrigins.includes(origin);
  const forwardedHost = req.headers?.['x-forwarded-host'] ? String(req.headers['x-forwarded-host']) : '';
  const host = forwardedHost || (req.headers?.host ? String(req.headers.host) : '');
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function getClientIp(req) {
  const xff = req.headers?.['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) return xff.split(',')[0].trim();
  if (Array.isArray(xff) && xff.length) return String(xff[0]).trim();
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const current = rateLimit.get(ip);
  if (!current || now >= current.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  current.count += 1;
  if (current.count <= RATE_LIMIT_MAX) return { allowed: true, retryAfterSeconds: 0 };
  return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
}

function parseRetryAfterSeconds(detailsText) {
  try {
    const data = JSON.parse(detailsText);
    const stack = [data];
    while (stack.length) {
      const node = stack.pop();
      if (!node) continue;
      if (typeof node === 'object') {
        if (typeof node.retryDelay === 'string') {
          const match = node.retryDelay.match(/(\d+)\s*s/i);
          if (match) return Number(match[1]);
        }
        for (const value of Object.values(node)) stack.push(value);
      }
    }
  } catch {
    // ignore
  }
  const match = String(detailsText || '').match(/"retryDelay"\s*:\s*"(\d+)\s*s"/i);
  return match ? Number(match[1]) : null;
}

function getCooldownRemainingSeconds(model) {
  const until = modelCooldownUntil.get(model) || 0;
  const remainingMs = until - Date.now();
  return remainingMs <= 0 ? 0 : Math.max(1, Math.ceil(remainingMs / 1000));
}

function setModelCooldownSeconds(model, seconds) {
  if (seconds && seconds > 0) modelCooldownUntil.set(model, Date.now() + seconds * 1000);
}

// Run one skill prompt on the user's input. Tries models in order, respecting cooldowns.
async function runSkill({ apiKey, modelsToTry, skill, focus, input }) {
  const instruction =
    `${skill.fullPrompt}\n\n` +
    `--- TASK FOR THIS RUN ---\n${focus}\n\n` +
    `Use ONLY the information in the input below. If something essential is missing, ` +
    `state the assumption explicitly or ask a clarifying question instead of inventing it.\n\n` +
    `--- INPUT ---\n${input}`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: instruction }] }],
    // 4096 leaves room for the model's internal "thinking" tokens (gemini-2.5-flash)
    // plus a full, detailed answer, so steps don't get truncated mid-sentence.
    generationConfig: { temperature: 0.4, topK: 40, topP: 0.95, maxOutputTokens: 4096 },
  };

  let lastError = null;
  for (const model of modelsToTry) {
    if (getCooldownRemainingSeconds(model) > 0) continue;
    const endpoint =
      `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}` +
      `:generateContent?key=${encodeURIComponent(apiKey)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!resp.ok) {
        const details = await resp.text();
        const err = new Error(`Gemini API error (${resp.status})`);
        err.status = resp.status;
        err.retryAfterSeconds = resp.status === 429 ? parseRetryAfterSeconds(details) : null;
        throw err;
      }
      const data = await resp.json();
      const parts = data?.candidates?.[0]?.content?.parts;
      const text = Array.isArray(parts)
        ? parts.map((p) => (p && typeof p.text === 'string' ? p.text : '')).join('')
        : '';
      if (!text.trim()) {
        const err = new Error('Empty response from Gemini API.');
        err.status = 502;
        throw err;
      }
      return { model, text };
    } catch (err) {
      lastError = err;
      if (err?.status === 429) {
        if (err?.retryAfterSeconds) setModelCooldownSeconds(model, err.retryAfterSeconds);
        continue;
      }
      if (err?.status === 404 || err?.status === 400) continue; // try next model
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError || new Error('All models failed for this step.');
}

// Maximum skills the auto-router may select for one request.
const AUTO_MAX_SKILLS = 5;

// Strip code fences / prose and parse the first JSON array/object found.
function parseJsonLoose(text) {
  if (!text) return null;
  let t = String(text).trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(t);
  } catch {
    const match = t.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* ignore */ }
    }
  }
  return null;
}

// v2 AUTO-ROUTER: ask the model which skills best fit the user's input.
// Returns [{ skillId, reason }], capped to AUTO_MAX_SKILLS and validated against the catalog.
async function routeSkills({ apiKey, modelsToTry, input }) {
  const catalogText = SKILL_CATALOG.map((s) =>
    `- id: ${s.id}\n  name: ${s.title}\n  use_when: ${s.use_when.join('; ')}\n  keywords: ${s.keywords.join(', ')}`
  ).join('\n');

  const routerPrompt =
    `You are a router for a recruitment skill library. Read the user's input and select ` +
    `EVERY skill (1 to ${AUTO_MAX_SKILLS}) that would genuinely add value to a complete, ` +
    `useful answer. Order them in the logical sequence they should run (e.g. clarify before ` +
    `sourcing).\n\n` +
    `Return ONLY a JSON array, no prose, like:\n` +
    `[{"skillId":"<id>","reason":"<short reason>"}]\n\n` +
    `Guidance:\n` +
    `- skillId MUST be one of the ids listed below. Never invent an id.\n` +
    `- Aim for a thorough answer: typically 2-4 skills. Include a skill whenever it adds a ` +
    `distinct, valuable angle; only drop ones that would be redundant or off-topic.\n` +
    `- If the input is a full job description, include role clarification, hiring-manager ` +
    `intake alignment, and sourcing strategy at minimum.\n` +
    `- If nothing fits well, return the single closest skill.\n\n` +
    `AVAILABLE SKILLS:\n${catalogText}\n\n` +
    `USER INPUT:\n${input}`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: routerPrompt }] }],
    generationConfig: { temperature: 0.1, topK: 20, topP: 0.9, maxOutputTokens: 512 },
  };

  let lastError = null;
  for (const model of modelsToTry) {
    if (getCooldownRemainingSeconds(model) > 0) continue;
    const endpoint =
      `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}` +
      `:generateContent?key=${encodeURIComponent(apiKey)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!resp.ok) {
        const details = await resp.text();
        const err = new Error(`Router error (${resp.status})`);
        err.status = resp.status;
        err.retryAfterSeconds = resp.status === 429 ? parseRetryAfterSeconds(details) : null;
        throw err;
      }
      const data = await resp.json();
      const parts = data?.candidates?.[0]?.content?.parts;
      const text = Array.isArray(parts) ? parts.map((p) => p?.text || '').join('') : '';
      const parsed = parseJsonLoose(text);
      const valid = Array.isArray(parsed)
        ? parsed
            .filter((x) => x && SKILL_PROMPTS[x.skillId])
            .slice(0, AUTO_MAX_SKILLS)
            .map((x) => ({ skillId: x.skillId, reason: String(x.reason || '').slice(0, 200) }))
        : [];
      if (valid.length) return valid;
      // Model replied but selection was unusable — fall back to closest by keyword.
      return keywordFallback(input);
    } catch (err) {
      lastError = err;
      if (err?.status === 429) {
        if (err?.retryAfterSeconds) setModelCooldownSeconds(model, err.retryAfterSeconds);
        continue;
      }
      if (err?.status === 404 || err?.status === 400) continue;
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
  if (lastError) throw lastError;
  return keywordFallback(input);
}

// Deterministic safety net if the router call yields nothing usable.
function keywordFallback(input) {
  const text = String(input).toLowerCase();
  let best = null, bestScore = 0;
  for (const s of SKILL_CATALOG) {
    const score = s.keywords.reduce((n, k) => (text.includes(k.toLowerCase()) ? n + 1 : n), 0);
    if (score > bestScore) { bestScore = score; best = s; }
  }
  const chosen = best || SKILL_CATALOG[0];
  return [{ skillId: chosen.id, reason: 'Closest match by keyword (router fallback).' }];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden', details: 'Request origin not allowed.' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Configuration error', details: 'GEMINI_API_KEY is not configured.' });
  }

  try {
    const ip = getClientIp(req);
    const gate = checkRateLimit(ip);
    if (!gate.allowed) {
      res.setHeader('Retry-After', String(gate.retryAfterSeconds));
      return res.status(429).json({ error: 'Rate limit exceeded', retryAfterSeconds: gate.retryAfterSeconds });
    }

    const { input = '', workflow = 'jd-intake', action = 'full', skillId = '', reason = '' } = req.body || {};
    const isAuto = workflow === 'auto';
    const wf = isAuto ? { label: 'Smart Assistant', inputLabel: 'request' } : WORKFLOWS[workflow];
    if (!wf) {
      return res.status(400).json({ error: 'Unknown workflow', details: `No workflow named "${workflow}".` });
    }
    if (typeof input !== 'string' || !input.trim()) {
      return res.status(400).json({ error: 'Missing input', details: `Please provide your ${wf.inputLabel.toLowerCase()}.` });
    }
    if (input.length > MAX_INPUT_LENGTH) {
      return res.status(400).json({
        error: 'Input too long',
        details: `Input exceeds ${MAX_INPUT_LENGTH} characters (current: ${input.length}).`,
      });
    }

    const primaryModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const extraFallbackModels = parseList(process.env.GEMINI_FALLBACK_MODELS);
    const modelsToTry = Array.from(
      new Set([primaryModel, 'gemini-2.5-flash-lite', 'gemini-3-flash', ...extraFallbackModels])
    ).filter(Boolean);

    const rateLimit429 = (err) => {
      res.setHeader('Retry-After', String(err?.retryAfterSeconds || 30));
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfterSeconds: err?.retryAfterSeconds || 30,
        details: 'The AI service is temporarily rate-limited. Please wait and try again.',
      });
    };

    // PHASED API (used by the Smart Assistant for live progress):
    //   action 'route' -> just pick the skills (fast), so the UI can show them immediately.
    //   action 'run'   -> run one named skill, so each result streams in as it finishes.
    if (action === 'route') {
      try {
        const selected = await routeSkills({ apiKey, modelsToTry, input });
        const routing = selected.map((s) => ({
          skillId: s.skillId,
          reason: s.reason,
          skillTitle: SKILL_PROMPTS[s.skillId]?.title || s.skillId,
          risk: SKILL_PROMPTS[s.skillId]?.risk || 'low',
        }));
        return res.status(200).json({ routing });
      } catch (err) {
        if (err?.status === 429) return rateLimit429(err);
        return res.status(502).json({ error: 'Routing failed', details: 'Could not select skills. Please try again.' });
      }
    }

    if (action === 'run') {
      const skill = SKILL_PROMPTS[skillId];
      if (!skill) {
        return res.status(400).json({ error: 'Unknown skill', details: `No skill "${skillId}".` });
      }
      const focus =
        'Apply this skill to the user input below and produce its standard, complete output. ' +
        'Use ONLY the information provided; state assumptions or ask clarifying questions ' +
        'rather than inventing details.';
      try {
        const { text } = await runSkill({ apiKey, modelsToTry, skill, focus, input });
        return res.status(200).json({
          step: { key: skillId, label: skill.title, skillId, skillTitle: skill.title, risk: skill.risk, reason, output: text },
        });
      } catch (err) {
        if (err?.status === 429) return rateLimit429(err);
        return res.status(200).json({
          step: { key: skillId, label: skill.title, skillId, skillTitle: skill.title, risk: skill.risk, reason, error: 'This step failed to generate. Please try again.' },
        });
      }
    }

    // Resolve the steps to run.
    // - Fixed workflow (e.g. jd-intake): use its predefined steps.
    // - Auto mode (v2 router): ask the model which skills fit, then run those.
    let workflowSteps;
    let routing = null;
    if (isAuto) {
      let selected;
      try {
        selected = await routeSkills({ apiKey, modelsToTry, input });
      } catch (err) {
        if (err?.status === 429) {
          res.setHeader('Retry-After', String(err?.retryAfterSeconds || 30));
          return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfterSeconds: err?.retryAfterSeconds || 30,
            details: 'The AI service is temporarily rate-limited. Please wait and try again.',
          });
        }
        return res.status(502).json({ error: 'Routing failed', details: 'Could not select skills. Please try again.' });
      }
      routing = selected;
      workflowSteps = selected.map((sel, i) => ({
        key: `auto-${i + 1}`,
        label: SKILL_PROMPTS[sel.skillId]?.title || sel.skillId,
        skillId: sel.skillId,
        reason: sel.reason,
        focus:
          'Apply this skill to the user input below and produce its standard, complete output. ' +
          'Use ONLY the information provided; state assumptions or ask clarifying questions ' +
          'rather than inventing details.',
      }));
    } else {
      workflowSteps = wf.steps;
    }

    // Run the chain sequentially. One failing step should not nuke the whole response.
    const steps = [];
    for (const step of workflowSteps) {
      const skill = SKILL_PROMPTS[step.skillId];
      if (!skill) {
        steps.push({ ...stepMeta(step), error: `Skill "${step.skillId}" not found.` });
        continue;
      }
      try {
        const { text } = await runSkill({ apiKey, modelsToTry, skill, focus: step.focus, input });
        steps.push({ ...stepMeta(step, skill), output: text });
      } catch (err) {
        const status = err?.status || 500;
        if (status === 429) {
          res.setHeader('Retry-After', String(err?.retryAfterSeconds || 30));
          return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfterSeconds: err?.retryAfterSeconds || 30,
            details: 'The AI service is temporarily rate-limited. Please wait and try again.',
          });
        }
        steps.push({ ...stepMeta(step, skill), error: 'This step failed to generate. Please try again.' });
      }
    }

    return res.status(200).json({ workflow, label: wf.label, routed: isAuto, routing, steps });
  } catch (err) {
    const isTimeout = err?.name === 'AbortError' || String(err).includes('abort');
    return res.status(500).json({
      error: 'Server error',
      details: isTimeout
        ? 'The request took too long. Please try again or shorten your input.'
        : 'An unexpected server error occurred. Please try again.',
      technicalDetails: process.env.NODE_ENV === 'development' ? String(err) : undefined,
    });
  }
}

function stepMeta(step, skill) {
  return {
    key: step.key,
    label: step.label,
    skillId: step.skillId,
    skillTitle: skill?.title || '',
    risk: skill?.risk || 'low',
    reason: step.reason || '',
  };
}
