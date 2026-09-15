# Aetherlab

Bank AI factory control plane: inventory → framing → train → evaluate → dual-control deploy → monitor → retire. HTTP contracts live in `packages/openapi-core/src/` (not a root `openapi.yaml`). Product docs: `PRODUCT.md`, `WEBAPP.md`, `USER_STORIES.md`.

Package scope: **`@aetherlab`**.

## Layout

```
packages/openapi-core  →  packages/core  →  platform/services  →  platform/adapters  →  platform/api-server
         ↑ OpenAPI source of truth                              ports↑        impl↑              HTTP↑
platform/webapp        → Vite React factory UI (hand zone in src/features)
```

## Quick start

```bash
pnpm install
pnpm lint:openapi && pnpm bundle:openapi
pnpm codegen:paths
pnpm build
PORT=4001 pnpm dev:api
pnpm dev:web
```

- Health: `curl http://127.0.0.1:4001/health`
- Demo API key: `X-API-Key: ddd_demo_local_dev_key`
- Operator login: `admin@demo.local` / `sandbox-admin-8`

`.codegen` is a local toolchain checkout. Never commit or push it.

## Domains

identity, projects, models, datasets, trainingjobs, evaluations, deployments, monitors, evidencepacks.

## Codegen (agents)

1. **New domain** → full multi-layer generate once (Mode A).
2. **YAML edit on existing domain** → regenerate **core only**, handwrite below (Mode B).
3. Keep envelopes (`{ data, meta }`), nested DI, and identity middleware intact.

See `.cursor/skills/` and `docs/CODEGEN.md`.
