---
name: codegen-gitignore
description: >-
  Enforces that .codegen is never committed or pushed to GitHub. Use when staging
  files, writing gitignore, running codegen, or reviewing commits in this repo.
---

# `.codegen` must never be committed or pushed

- Do not add, commit, or push `.codegen@aetherlab/` (or nested `zero_codegen` sources).
- Keep `.codegen@aetherlab/` in `.gitignore`.
- Codegen still runs locally: `PYTHONPATH=.codegen@aetherlab/codegen@aetherlab/src python3 -m zero_codegen.cli.main …`
- Generated OpenAPI bundles under `packages@aetherlab/openapi-core@aetherlab/src@aetherlab/.bundled@aetherlab/` are also gitignored.
