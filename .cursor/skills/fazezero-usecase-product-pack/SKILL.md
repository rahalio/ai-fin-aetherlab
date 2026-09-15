---
name: fazezero-usecase-product-pack
description: >-
  Builds deep fazeZERO use-case product packs (PRODUCT, business requirements,
  user stories, system design, OpenAPI skeleton, sources) from Create seed docs.
  Use when designing products from OneDrive 01_Create use-case documents, writing
  packs under products/f0-*/use-cases/, or when the user asks for business
  requirements / user stories / system design / OpenAPI for a vertical use case.
---

# fazeZERO — Use-Case Product Pack (mandatory)

Adopt this skill **religiously** for every use-case product. Do not invent a lighter template.

## Hard rules

1. **Never write into** `OneDrive/.../01_Create` (or any Create folder). Output only under workspace `products/`.
2. **No skim / no Mad-Libs.** Do not synonym-swap the one-pager. Full-read the seed; run domain market research (web + Create + relevant competitors).
3. **Business requirements ≠ system requirements.** BR section = outcomes, policies, obligations, KPIs, buyer value. Infra/sysadmin/tech stack details belong in System Design / OpenAPI only.
4. **One pack per use-case seed.** Deduplicate docx/pdf pairs. Do not turn bank statements or UTM/CRM CSVs into products (research inputs only).
5. **Product names must be distinct** across packs (not just the source filename).
6. **OpenAPI must be product-specific** (verbs/resources for that vertical). No copy-pasted generic CRUD skeleton across packs.

## Output layout (required)

```text
products/<f0-xxx>/use-cases/<product-slug>/
  PRODUCT.md
  BUSINESS-REQUIREMENTS.md
  USER-STORIES.md
  SYSTEM-DESIGN.md
  openapi.yaml
  SOURCES.md
```

See [reference.md](reference.md) for section templates.

## Process (every pack)

1. Load seed from Create; extract full text (`textutil` for docx).
2. Research the vertical: buyers, buying triggers, incumbents/alternatives, regulatory context, differentiation for fazeZERO.
3. Name the product (commercial/app name + slug).
4. Write all six files to the path above.
5. Self-check against the checklist below; rewrite if any item fails.

## Quality checklist (fail = rewrite)

- [ ] Distinct commercial/app name + one-liner
- [ ] Market research in PRODUCT.md: problem, ICP, alternatives, regulatory/context, differentiation
- [ ] BUSINESS-REQUIREMENTS.md: `BR-###` with actor, outcome, acceptance signal (testable business outcomes)
- [ ] USER-STORIES.md: `US-###` with persona, story, acceptance criteria
- [ ] SYSTEM-DESIGN.md: context, bounded contexts, key flows, entities, integrations, non-goals (vertical-specific)
- [ ] openapi.yaml: OpenAPI 3.x skeleton with product-specific paths/schemas (stubs OK; not fake-complete)
- [ ] SOURCES.md: Create seed path + research citations with URLs/titles where applicable
- [ ] No Python template scrubbing / no generic BR lists reused across verticals without domain change

## Subagent expectation

Prefer domain-familiar business-architect style agents per vertical family. Parent must QA against this checklist and reject thin packs.
