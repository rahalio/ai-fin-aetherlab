import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/*/index.ts', 'src/_shared/index.ts'],
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
});
