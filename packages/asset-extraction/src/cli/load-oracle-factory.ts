/* @layer shared-asset-extraction @kind logic */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ModuleFactory } from '../oracle/wasm/emscripten-module.type';

const loadOracleFactory = (gluePath: string): ModuleFactory => {
  const glue = resolve(gluePath);
  if (!existsSync(glue)) throw new Error(`the WASM oracle is not built (${glue}): node core/wasm-build/build.mjs`);
  const loaded = import(pathToFileURL(glue).href) as Promise<{ default: ModuleFactory }>;
  return async (options) => (await loaded).default(options);
};

export { loadOracleFactory };
