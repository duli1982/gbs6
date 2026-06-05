# GBS AI Hub

An agent-routable skill library generated from `gbs-prompts/gems.json`.

20 skills across 4 categories:

- **Analysis & Insights** — 3 skills
- **Candidate Engagement** — 3 skills
- **Process Optimization** — 8 skills
- **Strategic Planning** — 6 skills

## How it works

```
User request
   -> Agent reads manifests/skills-index.json
   -> Matches intent + keywords + output need
   -> Loads only the relevant skills/<category>/<skill>.md
   -> Follows that skill's executable instructions
   -> Applies guardrails for high-risk skills
   -> Returns output + human review checkpoint
```

## Structure

```
gbs-ai-hub/
├── skills/            # one executable .md per skill, grouped by category
├── manifests/
│   ├── skills-index.json   # routing map the agent reads first
│   ├── skills-index.md     # human-readable index
│   └── routing-rules.md    # agent decision logic
├── AGENT.md           # master system instruction
└── README.md
```

## Regenerating

This hub is generated. Edit the source (`gbs-prompts/gems.json`) and re-run:

```
python scripts/build_skills.py
```
