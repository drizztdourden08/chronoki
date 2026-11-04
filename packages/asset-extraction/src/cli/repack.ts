/* @layer shared-asset-extraction @kind logic */
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { repack as repackType } from './repack-main';

const HAS_EXTENSION = /\.[cm]?[jt]s$|\.json$/;

registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier.startsWith('.') && !HAS_EXTENSION.test(specifier) && context.parentURL !== undefined) {
      for (const suffix of ['.ts', '/index.ts']) {
        const url = new URL(`${specifier}${suffix}`, context.parentURL);
        if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const MAIN_MODULE = './repack-main.ts';
const { repack } = (await import(MAIN_MODULE)) as { repack: typeof repackType };

process.exitCode = await repack(process.argv.slice(2)).catch((e: unknown) => {
  console.error(`repack: ${e instanceof Error ? e.message : String(e)}`);
  return 1;
});
