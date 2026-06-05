# GBS AI Hub — Skill Routing Rules

## Objective

When the user makes a request, select the **smallest** number of relevant skills needed. Do not load every skill. Read `skills-index.json` first, then match intent + keywords + output need, then load only the chosen file(s).

## Routing process

1. Identify the user's task and workflow stage.
2. Match the request against each skill's `use_when` and `keywords`.
3. Select the single best-matching skill.
4. If the task spans stages, select up to three skills.
5. Load the selected `.md` file(s) and follow their instructions exactly.
6. If the request involves candidate data, assessment, ranking, rejection, or sensitive data, also apply the matching governance guardrails (see high-risk skills below).

## Skill selection map

- If the request matches **candidate-role, fit, analyst, analysis, insights, role-candidate** → use `analysis.fit_analyst` (Candidate-Role Fit Analyst).
- If the request matches **game, theory, recruitment, strategist, strategic, planning** → use `strategy.game_theory` (Game Theory Recruitment Strategist).
- If the request matches **recruiting, innovation, architect, process, optimization, designing** → use `operations.innovation_architect` (Recruiting Innovation Architect).
- If the request matches **recruitment, operations, architect, process, optimization, end-to-end** → use `operations.operations_architect` (Recruitment Operations Architect).
- If the request matches **strategy, architect, strategic, planning, annual, quarterly** → use `strategy.strategy_architect` (TA Strategy Architect).
- If the request matches **recruitment, results, architect, analysis, insights, monthly** → use `analysis.report_summarizer` (Recruitment Results Architect).
- If the request matches **evp, architect, strategic, planning, employer, value** → use `strategy.value_proposition` (EVP Architect).
- If the request matches **skills-hiring, architect, process, optimization, competency-based, hiring** → use `operations.skills_based_pro` (Skills-Hiring Architect).
- If the request matches **remote, hiring, specialist, process, optimization, remote-first** → use `operations.remote_hiring_pro` (Remote Hiring Specialist).
- If the request matches **talent, pipeline, strategist, strategic, planning, passive** → use `strategy.pipeline_strategist` (Talent Pipeline Strategist).
- If the request matches **referral, engine, architect, candidate, engagement, employee** → use `engagement.referral_narrative` (Referral Engine Architect).
- If the request matches **reject, respect, candidate, engagement, rejection, email** → use `engagement.reject_respect` (Reject with Respect).
- If the request matches **onboarding, strategist, process, optimization, day, plans** → use `operations.onboarding_guide` (Onboarding Strategist).
- If the request matches **search, strategist, strategic, planning, role-specific, strategy** → use `strategy.hiring_strategist_pro` (Search Strategist).
- If the request matches **employer, brand, architect, strategic, planning, system** → use `strategy.branding_architect_pro` (Employer Brand Architect).
- If the request matches **resume, skills, auditor, analysis, insights, screening** → use `analysis.resume_auditor` (Resume & Skills Auditor).
- If the request matches **screening, note, corrector, process, optimization, call** → use `operations.screening_note_corrector` (Screening Note Corrector).
- If the request matches **recruiting, comms, editor, candidate, engagement, recruiter** → use `engagement.recruiting_comms_editor` (Recruiting Comms Editor).
- If the request matches **time, reinvestment, strategist, process, optimization, ai-saved** → use `operations.time_reinvestment_strategist` (Time Reinvestment Strategist).
- If the request matches **hiring, manager, alignment, architect, process, optimization** → use `operations.hiring_manager_alignment_architect` (Hiring Manager Alignment Architect).

## High-risk skills (require human review)

- `analysis.report_summarizer` — risk: **medium**. Enforce the guardrails and human review checkpoint in the file.
- `engagement.referral_narrative` — risk: **medium**. Enforce the guardrails and human review checkpoint in the file.
- `engagement.reject_respect` — risk: **high**. Enforce the guardrails and human review checkpoint in the file.
- `analysis.resume_auditor` — risk: **high**. Enforce the guardrails and human review checkpoint in the file.
- `operations.screening_note_corrector` — risk: **high**. Enforce the guardrails and human review checkpoint in the file.
- `engagement.recruiting_comms_editor` — risk: **medium**. Enforce the guardrails and human review checkpoint in the file.

## Conflict rule

If two skills seem relevant, choose the one closest to the user's immediate output need. Sequence the rest (e.g. clarify the role first, then build sourcing).

## Maximum skill loading

- Default: one skill.
- Complex workflow: two to three skills.
- High-risk workflow: always include the relevant guardrails.
