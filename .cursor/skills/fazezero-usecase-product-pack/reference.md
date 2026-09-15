# Use-Case Product Pack — File Templates

Fill every section with domain-specific content. Empty placeholders fail QA.

## PRODUCT.md

```markdown
# <Commercial / App Name>

| Field | Value |
| --- | --- |
| Slug | <product-slug> |
| Parent portfolio | f0-<xxx> |
| Seed | <relative Create path> |
| One-liner | <single sentence> |

## Positioning
...

## Ideal customer profile (ICP)
...

## Market research summary
### Problem
### Buyers and buying triggers
### Alternatives / incumbents
### Regulatory and market context
### Differentiation (fazeZERO)
```

## BUSINESS-REQUIREMENTS.md

```markdown
# Business Requirements — <Name>

Rules: outcomes/policies/KPIs only. No “must use Kubernetes” style system reqs.

## BR-001 — <Title>
- **Actor:** ...
- **Outcome:** ...
- **Acceptance signal:** ...
- **Business KPI (optional):** ...
```

Minimum bar: typically **8–15** BRs per pack, vertical-specific.

## USER-STORIES.md

```markdown
# User Stories — <Name>

## Personas
| ID | Persona | Goal |
| --- | --- | --- |

## US-001 — <Title>
**As a** <persona>, **I want** <capability>, **so that** <business value>.

### Acceptance criteria
1. ...
2. ...
```

Minimum bar: typically **8–12** stories covering primary journeys.

## SYSTEM-DESIGN.md

```markdown
# System Design — <Name>

## Context
(prose + mermaid context diagram)

## Bounded contexts
## Key flows
## Core entities
## Integrations
## Non-goals
```

## openapi.yaml

OpenAPI 3.0+ skeleton: `info`, `servers` (placeholder), `tags`, `paths` for primary resources, `components.schemas` stubs. Paths must match this product’s domain verbs (e.g. CBDC policy vs energy meter claim — not identical CRUD).

## SOURCES.md

```markdown
# Sources — <Name>

## Create seed
- path: ...

## Research
- Title — URL — what it informed
```
