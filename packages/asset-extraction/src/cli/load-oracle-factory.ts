/* @layer shared-asset-extraction @kind logic */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import type { ModuleFactory } from '../oracle/wasm/emscripten-module.type';

const loadOracleFactory = (gluePath: string): ModuleFactory => {
  const glue = resolve(gluePath);
  if (!existsSync(glue)) throw new Error(`the WASM oracle is not built (${glue}): node core/wasm-build/build.mjs`);
  return createRequire(import.meta.url)(glue) as ModuleFactory;
};

export { loadOracleFactory };
