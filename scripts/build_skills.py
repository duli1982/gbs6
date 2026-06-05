#!/usr/bin/env python3
"""
build_skills.py — Redesign the GBS prompt hub into an agent-routable skill library.

Source of truth:  gbs-prompts/gems.json
Output:           gbs-ai-hub/

It produces, for every gem:
  - one standalone, executable .md skill file (frontmatter + instructions)
and, once:
  - manifests/skills-index.json   (lightweight routing map the agent reads first)
  - manifests/skills-index.md     (human-readable index)
  - manifests/routing-rules.md    (agent decision logic)
  - AGENT.md                      (master system instruction)
  - README.md

Re-run any time gems.json changes to keep the hub in sync.
"""

import json
import re
import os
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "gbs-prompts" / "gems.json"
OUT = ROOT / "gbs-ai-hub"

# Map source categories -> folder slug used in skills/<folder>/
CATEGORY_FOLDER = {
    "Analysis & Insights": "analysis",
    "Strategic Planning": "strategy",
    "Process Optimization": "operations",
    "Candidate Engagement": "engagement",
}

# Lightweight stopword list for keyword extraction
STOP = set("""a an the and or of for to in on with your you their this that from at as is are
be by it its into about over more most can will help using use used new not only without
toward across both each every per via vs within among other others top high low real same""".split())


def slug(text: str) -> str:
    text = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return text


def folder_for(category: str) -> str:
    return CATEGORY_FOLDER.get(category, slug(category or "general"))


def derive_keywords(gem: dict) -> list:
    """Pull distinctive words from title + perfectFor + category."""
    blob = " ".join([gem.get("title", ""), gem.get("category", "")] + gem.get("perfectFor", []))
    words = re.findall(r"[a-zA-Z][a-zA-Z\-]{2,}", blob.lower())
    seen, out = set(), []
    for w in words:
        if w in STOP or w in seen:
            continue
        seen.add(w)
        out.append(w)
    return out[:14]


def derive_outputs(gem: dict) -> list:
    return [kf["title"] for kf in gem.get("keyFeatures", []) if kf.get("title")]


def related(gem: dict, all_gems: list) -> list:
    """Same-category siblings (excluding self), capped, plus governance link."""
    cat = gem.get("category")
    sibs = [
        f"{folder_for(cat)}.{g['id'].replace('-', '_')}"
        for g in all_gems
        if g.get("category") == cat and g["id"] != gem["id"]
    ]
    return sibs[:3] + ["governance.human_decision_ownership"]


def yaml_list(items, indent="  "):
    if not items:
        return " []"
    return "\n" + "\n".join(f"{indent}- {yaml_scalar(i)}" for i in items)


def yaml_scalar(s):
    s = str(s).replace("\n", " ").strip()
    if re.search(r'[:#\[\]{}",]', s) or s == "":
        return '"' + s.replace('"', '\\"') + '"'
    return s


def build_frontmatter(gem: dict, all_gems: list) -> str:
    cat = gem.get("category", "")
    sid = f"{folder_for(cat)}.{gem['id'].replace('-', '_')}"
    risk = gem.get("dataHandling", {}).get("riskLevel", "low")
    human_review = "true" if risk in ("medium", "high") else "false"
    keywords = derive_keywords(gem)
    outputs = derive_outputs(gem)
    use_when = gem.get("perfectFor", [])
    sensitivity = gem.get("dataHandling", {}).get("summary", "").replace("\n", " ").strip()

    fm = []
    fm.append("---")
    fm.append(f"skill_id: {sid}")
    fm.append(f"skill_name: {yaml_scalar(gem.get('title',''))}")
    fm.append("version: 1.0")
    fm.append(f"status: {gem.get('status','Active').lower()}")
    fm.append(f"category: {yaml_scalar(cat)}")
    fm.append(f"source_gem_id: {gem['id']}")
    fm.append("primary_users:")
    fm.append("  - recruiter")
    fm.append("  - sourcer")
    fm.append("  - team_lead")
    fm.append("use_when:" + yaml_list(use_when))
    fm.append("keywords:" + yaml_list(keywords))
    fm.append("outputs:" + yaml_list(outputs))
    fm.append(f"risk_level: {risk}")
    fm.append(f"human_review_required: {human_review}")
    fm.append(f"data_sensitivity: {yaml_scalar(sensitivity)}")
    fm.append("related_skills:" + yaml_list(related(gem, all_gems)))
    fm.append("owner: GBS AI Hub")
    fm.append(f"last_updated: {date.today().isoformat()}")
    fm.append("---")
    return "\n".join(fm)


def build_body(gem: dict) -> str:
    dh = gem.get("dataHandling", {})
    b = []
    b.append(f"# {gem.get('title','')}")
    b.append("")
    b.append("## Purpose")
    b.append("")
    b.append(gem.get("overview", gem.get("description", "")))
    b.append("")
    b.append("## When to use")
    b.append("")
    for p in gem.get("perfectFor", []):
        b.append(f"- {p}")
    b.append("")
    b.append("## What it produces")
    b.append("")
    for kf in gem.get("keyFeatures", []):
        b.append(f"- **{kf.get('title','')}** — {kf.get('description','')}")
    b.append("")
    b.append("## Setup")
    b.append("")
    for i, s in enumerate(gem.get("setupSteps", []), 1):
        b.append(f"{i}. {s}")
    b.append("")
    b.append("## Instructions (executable prompt)")
    b.append("")
    b.append("> Follow this prompt exactly when this skill is selected. "
             "Substitute the bracketed inputs with the user's real data.")
    b.append("")
    b.append("```text")
    b.append(gem.get("fullPrompt", "").strip())
    b.append("```")
    b.append("")
    if gem.get("usageExamples"):
        b.append("## Examples")
        b.append("")
        for ex in gem["usageExamples"]:
            b.append(f"- **{ex.get('title','')}** — {ex.get('description','')}")
            if ex.get("output"):
                b.append(f"  - Output: {ex['output']}")
        b.append("")
    b.append("## Guardrails")
    b.append("")
    b.append(f"- Risk level: **{dh.get('riskLevel','low')}**. "
             + ("Human review required before using the output." if dh.get("riskLevel") in ("medium", "high")
                else "Standard human review applies."))
    if dh.get("summary"):
        b.append(f"- Data handling: {dh['summary']}")
    for item in dh.get("anonymizationGuide", []):
        b.append(f"- Anonymize: {item}")
    if dh.get("doNotPaste"):
        b.append("- **Never paste:**")
        for item in dh["doNotPaste"]:
            b.append(f"  - {item}")
    if dh.get("enterpriseNote"):
        b.append(f"- {dh['enterpriseNote']}")
    b.append("- AI supports the work. The human user owns the final decision.")
    b.append("")
    b.append("## Human review checkpoint")
    b.append("")
    b.append("Before sending or acting on this output, the user must validate facts, "
             "remove assumptions, and confirm no sensitive data was exposed.")
    b.append("")
    return "\n".join(b)


def main():
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    gems = data["gems"]

    skills_dir = OUT / "skills"
    manifests_dir = OUT / "manifests"
    skills_dir.mkdir(parents=True, exist_ok=True)
    manifests_dir.mkdir(parents=True, exist_ok=True)

    index = {"version": 1, "generated": date.today().isoformat(), "skills": []}

    for gem in gems:
        cat = gem.get("category", "")
        folder = folder_for(cat)
        (skills_dir / folder).mkdir(parents=True, exist_ok=True)
        fname = f"{gem['id']}.md"
        path = skills_dir / folder / fname
        content = build_frontmatter(gem, gems) + "\n\n" + build_body(gem)
        path.write_text(content, encoding="utf-8")

        sid = f"{folder}.{gem['id'].replace('-', '_')}"
        index["skills"].append({
            "skill_id": sid,
            "skill_name": gem.get("title", ""),
            "file_path": f"skills/{folder}/{fname}",
            "category": cat,
            "description": gem.get("description", ""),
            "use_when": gem.get("perfectFor", []),
            "keywords": derive_keywords(gem),
            "risk_level": gem.get("dataHandling", {}).get("riskLevel", "low"),
        })

    # skills-index.json
    (manifests_dir / "skills-index.json").write_text(
        json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")

    # skills-index.md (human readable)
    md = ["# GBS AI Hub — Skills Index", "",
          f"Generated {index['generated']} from `gbs-prompts/gems.json`. "
          f"{len(gems)} skills.", ""]
    by_cat = {}
    for s in index["skills"]:
        by_cat.setdefault(s["category"], []).append(s)
    for cat in sorted(by_cat):
        md.append(f"## {cat}")
        md.append("")
        md.append("| Skill | ID | Risk | File |")
        md.append("|---|---|---|---|")
        for s in by_cat[cat]:
            md.append(f"| {s['skill_name']} | `{s['skill_id']}` | {s['risk_level']} | "
                      f"[{s['file_path']}]({s['file_path']}) |")
        md.append("")
    (manifests_dir / "skills-index.md").write_text("\n".join(md), encoding="utf-8")

    # routing-rules.md
    routing = build_routing_rules(index["skills"])
    (manifests_dir / "routing-rules.md").write_text(routing, encoding="utf-8")

    # AGENT.md
    (OUT / "AGENT.md").write_text(build_agent_instructions(), encoding="utf-8")

    # api/skill-prompts.generated.js — static ESM module the serverless
    # workflow function imports (reliable Vercel bundling, single source of truth).
    emit_skill_prompts_module(gems)

    # README.md
    (OUT / "README.md").write_text(build_readme(len(gems), by_cat), encoding="utf-8")

    print(f"Built {len(gems)} skills into {OUT}")
    for cat, items in by_cat.items():
        print(f"  {cat}: {len(items)}")


def build_routing_rules(skills: list) -> str:
    lines = ["# GBS AI Hub — Skill Routing Rules", "",
             "## Objective", "",
             "When the user makes a request, select the **smallest** number of relevant "
             "skills needed. Do not load every skill. Read `skills-index.json` first, "
             "then match intent + keywords + output need, then load only the chosen file(s).",
             "",
             "## Routing process", "",
             "1. Identify the user's task and workflow stage.",
             "2. Match the request against each skill's `use_when` and `keywords`.",
             "3. Select the single best-matching skill.",
             "4. If the task spans stages, select up to three skills.",
             "5. Load the selected `.md` file(s) and follow their instructions exactly.",
             "6. If the request involves candidate data, assessment, ranking, rejection, "
             "or sensitive data, also apply the matching governance guardrails "
             "(see high-risk skills below).",
             "",
             "## Skill selection map", ""]
    for s in skills:
        kws = ", ".join(s["keywords"][:6])
        lines.append(f"- If the request matches **{kws}** → use `{s['skill_id']}` "
                     f"({s['skill_name']}).")
    lines += ["",
              "## High-risk skills (require human review)", ""]
    for s in skills:
        if s["risk_level"] in ("medium", "high"):
            lines.append(f"- `{s['skill_id']}` — risk: **{s['risk_level']}**. "
                         "Enforce the guardrails and human review checkpoint in the file.")
    lines += ["",
              "## Conflict rule", "",
              "If two skills seem relevant, choose the one closest to the user's immediate "
              "output need. Sequence the rest (e.g. clarify the role first, then build sourcing).",
              "",
              "## Maximum skill loading", "",
              "- Default: one skill.",
              "- Complex workflow: two to three skills.",
              "- High-risk workflow: always include the relevant guardrails.",
              ""]
    return "\n".join(lines)


def build_agent_instructions() -> str:
    return """# GBS AI Hub Agent — Master Instruction

You are the GBS AI Hub Agent. You help users complete GBS recruitment work by
selecting the most relevant skill from the GBS AI Hub skill library.

You must NOT read every skill file by default.

## Process

1. Read `manifests/skills-index.json`.
2. Understand the user request.
3. Select the most relevant skill using `use_when`, `keywords`, `category`, and output need.
4. Load the selected `.md` skill file and follow its instructions and output format.
5. If the request involves candidate data, assessment, hiring decisions, sensitive
   information, or compliance risk, also apply the relevant guardrails from
   `manifests/routing-rules.md`.
6. If no skill matches, ask one short clarification question or use the closest skill.
7. Never invent missing source information. State assumptions clearly.
8. AI supports the work. The human user owns the final decision.

## Always return

- **Skill used**
- **Why this skill was selected**
- **Output** (per the skill's format)
- **Human review checkpoint**
- **Suggested next action**
"""


def emit_skill_prompts_module(gems: list):
    """Write api/skill-prompts.generated.js.

    Exports two objects:
      SKILL_PROMPTS  — id -> { title, category, risk, fullPrompt }  (for execution)
      SKILL_CATALOG  — [ { id, title, category, risk, description,    (for routing)
                           use_when, keywords } ]  — compact, no heavy prompt text
    """
    api_dir = ROOT / "api"
    api_dir.mkdir(exist_ok=True)
    prompts = {}
    catalog = []
    for g in gems:
        risk = g.get("dataHandling", {}).get("riskLevel", "low")
        prompts[g["id"]] = {
            "title": g.get("title", ""),
            "category": g.get("category", ""),
            "risk": risk,
            "fullPrompt": g.get("fullPrompt", "").strip(),
        }
        catalog.append({
            "id": g["id"],
            "title": g.get("title", ""),
            "category": g.get("category", ""),
            "risk": risk,
            "description": g.get("description", ""),
            "use_when": g.get("perfectFor", []),
            "keywords": derive_keywords(g),
        })
    header = (
        "// AUTO-GENERATED by scripts/build_skills.py — do not edit by hand.\n"
        "// Source of truth: gbs-prompts/gems.json. Re-run the generator to update.\n\n"
        "// Full executable prompts, keyed by skill (gem) id — used to RUN a skill.\n"
        "export const SKILL_PROMPTS = "
    )
    mid = (
        ";\n\n// Compact routing metadata — used by the auto-router to SELECT skills.\n"
        "export const SKILL_CATALOG = "
    )
    (api_dir / "skill-prompts.generated.js").write_text(
        header + json.dumps(prompts, indent=2, ensure_ascii=False)
        + mid + json.dumps(catalog, indent=2, ensure_ascii=False) + ";\n",
        encoding="utf-8")


def build_readme(count: int, by_cat: dict) -> str:
    cat_lines = "\n".join(f"- **{c}** — {len(v)} skills" for c, v in sorted(by_cat.items()))
    return f"""# GBS AI Hub

An agent-routable skill library generated from `gbs-prompts/gems.json`.

{count} skills across {len(by_cat)} categories:

{cat_lines}

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
"""


if __name__ == "__main__":
    main()
