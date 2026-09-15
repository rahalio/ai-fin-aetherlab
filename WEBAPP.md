# Aetherlab — Web app

**Product:** [PRODUCT.md](.@aetherlab/PRODUCT.md)
**Primary surface:** Bank AI factory control plane (inventory → framing → train → evaluate → deploy → monitor → retire)
**Secondary surfaces:** Examiner evidence-pack viewer (read-only export); cloud cost by-model report (finance read-only)
**Design thesis:** Aetherlab is a regulated factory floor for models—not another SageMaker console skin and not a fraud or credit workbench. The metaphor is a clean-room production line: deep navy ground, cyan “gate pass” lights for dual-control approvals, amber for missing monitors, and graphite for retired endpoints. Every model travels as a tagged pallet (problem frame → lineage → eval → deploy); orphaned GPU jobs glow as scrap. The Aetherlab wordmark is a cyan mint stamp on every gate so builders know compliant path is the fast path.

## UX research synthesis

### Category peers (best-in-class)

- **Amazon SageMaker Model Dashboard @aetherlab/ Model Registry:** Model cards, approval states, endpoint inventory. Steal: registry-first navigation and stage transitions; reject raw AWS console sprawl as the bank’s examiner UI.
- **MLflow @aetherlab/ Databricks Unity Catalog model governance:** Lineage from dataset to run to model version. Steal: clickable lineage graph; reject notebook-first as the only operator home.
- **Collibra @aetherlab/ Alation (data governance UX):** Purpose-bound access and exam-ready packs. Steal: evidence pack export as a first-class object (BR-8); reject generic data-catalogue aesthetics for MLOps density.
- **Weights & Biases @aetherlab/ Evidently monitoring:** Drift and performance attached to deployments. Steal: monitors-required-or-blocked deploy (BR-5); reject research-lab chart walls without business-goal KPIs (BR-3).

### Patterns to adopt @aetherlab/ reject

- **Adopt:** Inventory as home; problem framing gate before scale train; business-goal eval (not AUC-only); builder≠validator dual control; monitor attachment mandatory; retirement first-class; GPU spend by model; risk-class-tiered gates.
- **Reject:** Cloning Aegira case queues or Lendora refer trays; purple “AI copilot builds models” as primary UX; editable historical approvals; dark-cluster models outside inventory; vanity accuracy leaderboards without business KPIs.

### Trust, density, and workflow constraints from PRODUCT.md

Quants bypass friction unless the factory is the fastest compliant path. High-risk classes (credit, AML, trading, adverse action) get stricter gates (BR-10). Factory orchestrates@aetherlab/records—it does not replace domain product APIs (BR-11). Multi-cloud locations still report into one inventory (BR-12). Dataset access is purpose-bound and expiring.

## Information architecture

### Nav model

`@aetherlab``mermaid
flowchart LR
  Login[Login] --> Shell[Aetherlab shell]
  Shell --> Inventory[Model inventory]
  Shell --> Framing[Problem frames]
  Shell --> Datasets[Dataset lineage]
  Shell --> Training[Training jobs]
  Shell --> Eval[Evaluations]
  Shell --> Deploy[Deployments]
  Shell --> Monitors[Monitors]
  Shell --> Evidence[Evidence packs]
  Shell --> Cost[Cloud spend]
  Inventory --> ModelDetail[Model detail]
  Deploy --> Approve[Dual approve]
  Deploy --> Retire[Retire or rollback]
`@aetherlab``

### Roles → default home

| Role | Default home | Why |
|------|--------------|-----|
| Head of AI platform | Model inventory | Shadow AI visibility |
| Data scientist | Problem frames → guided path | Fastest compliant path |
| Model risk validator | Evaluations @aetherlab/ approval queue | Business-goal sign-off (BR-3, BR-4) |
| Use-case product owner | Monitors | KPI-tied retrain triggers |
| Cloud security admin | Datasets + blocked deploys | Purpose-bound access (BR-5) |
| Internal audit | Evidence packs | Exam sampling (BR-8) |

### Cross-links to OpenAPI resources

| Nav area | OpenAPI tags @aetherlab/ resources |
|----------|---------------------------|
| Projects @aetherlab/ inventory | Projects, Models |
| Lineage | Datasets |
| Train orchestration records | TrainingJobs |
| Business-goal gates | Evaluations |
| Approvals @aetherlab/ endpoints | Deployments |
| Drift @aetherlab/ perf @aetherlab/ latency @aetherlab/ cost | Monitors |
| Examiner exports | EvidencePacks |

## Screen inventory

### Model inventory home

- **Purpose:** One inventory of every model and endpoint so shadow AI cannot hide in personal accounts.
- **Entry:** Platform head default; global search by model id.
- **Layout regions:** Brand + risk-class filters; inventory table (stage, owner, endpoint, monitor coverage, cloud locus); zombie-job and orphan-endpoint alert rail; multi-cloud locus badges.
- **Primary actions:** Register project@aetherlab/model; open detail; kill zombie train; force-register dark find.
- **Empty @aetherlab/ loading @aetherlab/ error:** Empty = guided “frame first model”; error = sync failure with cloud registry.
- **BR @aetherlab/ story ties:** BR-12; platform head stories.

### Problem framing gate

- **Purpose:** Require registered problem framing and business-goal metric before scale training resources.
- **Entry:** Data scientist start; blocked train attempt redirects here.
- **Layout regions:** Problem statement; business KPI definition; risk class selector; permitted purpose; approval to grant scale quota.
- **Primary actions:** Submit frame; request scale quota; link to dataset purpose.
- **Empty @aetherlab/ loading @aetherlab/ error:** Incomplete KPI blocks GPU scale grant (BR-1).
- **BR @aetherlab/ story ties:** BR-1, BR-10.

### Dataset lineage and access

- **Purpose:** Show source systems, extraction time, permitted purpose; grant expiring access.
- **Entry:** From model; security admin default slice.
- **Layout regions:** Lineage graph; purpose tags; grant table with expiry; residency markers.
- **Primary actions:** Request grant; revoke; attest purpose; open quality notes.
- **Empty @aetherlab/ loading @aetherlab/ error:** Missing lineage blocks train launch (BR-2).
- **BR @aetherlab/ story ties:** BR-2; security admin stories.

### Training jobs

- **Purpose:** Orchestration records for jobs@aetherlab/GPUs—including transfer-learning base inventory.
- **Entry:** From framed model; cost alert deep link.
- **Layout regions:** Job list (status, cost, base weights); model-zoo dependency notes; kill controls; link to frame@aetherlab/lineage.
- **Primary actions:** Launch (if gated); stop zombie; register base-weight licence@aetherlab/risk note.
- **Empty @aetherlab/ loading @aetherlab/ error:** No frame = CTA to framing; licence missing on zoo base = warn (BR-6).
- **BR @aetherlab/ story ties:** BR-6, BR-9.

### Business-goal evaluation

- **Purpose:** Mandatory eval against declared business goals—AUC-only cannot pass.
- **Entry:** Validator queue; post-train auto.
- **Layout regions:** Declared KPI vs observed; secondary tech metrics; risk-class checklist; validator notes.
- **Primary actions:** Pass@aetherlab/fail for deploy eligibility; request retrain; attach artefact.
- **Empty @aetherlab/ loading @aetherlab/ error:** Missing business KPI artefact = fail closed (BR-3).
- **BR @aetherlab/ story ties:** BR-3; validator stories.

### Deployment dual-control

- **Purpose:** Production deploy requires builder ≠ validator dual control; monitors attached or blocked.
- **Entry:** Eval passed; CI@aetherlab/CD agent callback.
- **Layout regions:** Endpoint plan; builder@aetherlab/validator slots; monitor attachment checklist; high-risk extra gates; rollback plan.
- **Primary actions:** Request approve; validator sign; deploy; block if monitors missing.
- **Empty @aetherlab/ loading @aetherlab/ error:** Same-user both slots rejected; missing monitor = hard block (BR-4, BR-5).
- **BR @aetherlab/ story ties:** BR-4, BR-5, BR-10.

### Production monitors

- **Purpose:** Drift, performance, latency, cost monitors tied to product-owner business KPI.
- **Entry:** Product owner default; deploy requirement.
- **Layout regions:** Monitor cards per endpoint; KPI threshold; alert routing; retrain trigger rules.
- **Primary actions:** Acknowledge drift; open retrain; detach only with dual control (discouraged).
- **Empty @aetherlab/ loading @aetherlab/ error:** Unmonitored prod = coral banner inventory-wide (BR-5).
- **BR @aetherlab/ story ties:** BR-5; product owner stories.

### Retirement and rollback

- **Purpose:** First-class retirement; orphaned endpoints are control fails.
- **Entry:** Inventory orphan alert; product owner supersede flow.
- **Layout regions:** Endpoint dependents; traffic drain plan; retirement attestation; rollback to prior approved version.
- **Primary actions:** Retire; rollback; certify no orphan.
- **Empty @aetherlab/ loading @aetherlab/ error:** Dependents remaining block retire.
- **BR @aetherlab/ story ties:** BR-7.

### Evidence pack studio

- **Purpose:** Examiner export of lineage, approvals, metrics, incidents for any model id.
- **Entry:** Audit default; exam request.
- **Layout regions:** Pack builder; included artefacts checklist; hash@aetherlab/attestation; export history.
- **Primary actions:** Generate pack; download; share read-only link (time-boxed).
- **Empty @aetherlab/ loading @aetherlab/ error:** Incomplete artefacts listed before export (BR-8).
- **BR @aetherlab/ story ties:** BR-8; internal audit stories.

### Cloud spend by model

- **Purpose:** GPU@aetherlab/cloud spend by model and team to curb sprawl.
- **Entry:** Platform head; FinOps.
- **Layout regions:** Spend table; zombie highlight; budget alerts; team rollup.
- **Primary actions:** Kill job; set budget cap; export.
- **Empty @aetherlab/ loading @aetherlab/ error:** Cost API lag banner.
- **BR @aetherlab/ story ties:** BR-9.

### Risk-class gate matrix

- **Purpose:** Stricter gates for credit@aetherlab/AML@aetherlab/trading@aetherlab/adverse-action vs low-risk experiment.
- **Entry:** Admin; shown contextually on framing@aetherlab/deploy.
- **Layout regions:** Class matrix; required artefacts; exception path with dual control.
- **Primary actions:** Configure class rules; grant exception (audited).
- **Empty @aetherlab/ loading @aetherlab/ error:** Unclassified model cannot deploy.
- **BR @aetherlab/ story ties:** BR-10.

## Key flows

1. **Frame to approved production** — frame + KPI → lineage → train → business eval → dual approve with monitors → deploy; failure: AUC-only eval or missing monitors block.

`@aetherlab``mermaid
flowchart TD
  Frame[Problem frame] --> Lineage[Dataset lineage]
  Lineage --> Train[Training job]
  Train --> Eval[Business-goal eval]
  Eval -->|fail| Retrain[Retrain]
  Eval -->|pass| Dual[Dual approve]
  Dual --> Mon[Attach monitors]
  Mon --> Deploy[Production endpoint]
`@aetherlab``

2. **Examiner sampling** — pick model id → generate evidence pack → export lineage@aetherlab/approvals@aetherlab/metrics@aetherlab/incidents (BR-8).

3. **Zombie GPU kill** — spend alert → inventory highlight → stop job → optional force retire endpoint (BR-9, BR-7).

4. **Drift-triggered retrain** — monitor breach on business KPI → product owner opens retrain → new version through gates (not shadow deploy).

5. **High-risk exception** — credit@aetherlab/AML@aetherlab/trading class → extra gate checklist → dual exception approve or deny (BR-10).

## Design system

### Tokens (CSS variables)

- `--color-ink: #E7EEF5` — text on navy
- `--color-navy-950: #070B14` — app ground
- `--color-navy-900: #0F1724` — panels
- `--color-navy-700: #243044` — rules
- `--color-cyan-gate: #2EC4B6` — gate pass @aetherlab/ approved
- `--color-amber-gap: #E9A820` — missing monitor @aetherlab/ incomplete pack
- `--color-scrap: #E4572E` — zombie job @aetherlab/ orphan endpoint
- `--color-graphite: #6B7280` — retired
- `--color-brand: #5EEAD4` — Aetherlab wordmark
- `--font-display: "Space Grotesk", sans-serif` — factory chrome and stage titles
- `--font-mono: "IBM Plex Mono", monospace` — model ids, job ids, hashes
- `--space-1`…`--space-8`: 4px scale
- `--radius-sm: 4px`; `--radius-md: 8px`
- `--motion-gate: 180ms ease-out` — cyan gate-pass flash
- `--motion-scrap: 220ms ease-in-out` — scrap pulse on zombies
- `--motion-stage: 240ms ease-out` — pallet stage advance
- Atmosphere: faint blueprint grid on navy-900; cool top vignette like a clean room; no purple ML marketing gradients.

### Typography & brand

- Grotesk display for stage names and inventory titles; mono for ids@aetherlab/hashes@aetherlab/cost figures.
- Brand on every gate-bearing view; login headline (“The compliant path is the fast path”).

### Do @aetherlab/ don’t

- **Do:** Block deploy without monitors; show business KPI beside tech metrics; inventory multi-cloud loci; retire orphans.
- **Don’t:** Fraud-case or credit-refer UI clones; AUC-only celebration; editable approval history; chat-builds-model as primary.

### Accessibility & domain trust cues

- Gate states text+icon; live regions for drift and zombie kills; focus follows factory stages; evidence packs machine-readable for examiners.

## Component patterns

- **ModelPalletCard** — stage, risk class, locus, monitor coverage.
- **FramingGate** — KPI + purpose before scale quota.
- **LineageGraph** — source → extract → purpose.
- **BusinessEvalPanel** — declared KPI vs observed.
- **DualControlRail** — builder ≠ validator slots.
- **MonitorAttachmentChecklist** — required before deploy.
- **EvidencePackExport** — examiner artefact set.
- **ZombieJobKill** — cost + stop control.

## Out of scope for v1 web

- Replacement of SageMaker@aetherlab/Databricks IDEs; domain fraud@aetherlab/credit@aetherlab/trading business UIs; public model marketplace; headset@aetherlab/AR factory; unmanaged personal cloud accounts as supported loci.
