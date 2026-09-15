#!/usr/bin/env node
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'packages', 'openapi-core', 'src');
const bundled = join(src, '.bundled');
mkdirSync(bundled, { recursive: true });

const domains = [
  'identity',
  'projects',
  'models',
  'datasets',
  'trainingjobs',
  'evaluations',
  'deployments',
  'monitors',
  'evidencepacks',
];

for (const domain of domains) {
  for (const ext of ['openapi.yaml', 'json']) {
    const out = join(bundled, `${domain}.${ext === 'json' ? 'json' : 'openapi.yaml'}`);
    const r = spawnSync(
      'pnpm',
      ['exec', 'redocly', 'bundle', domain, '--output', out],
      { cwd: join(root, 'packages', 'openapi-core'), stdio: 'inherit' }
    );
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}
