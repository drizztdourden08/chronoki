/* @layer shared-asset-extraction @kind logic */
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { repack as repackType } from './repack-main';

const hasExtension = /\.[cm]?[jt]s$|\.json$/;

registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier.startsWith('.') && !hasExtension.test(specifier) && context.parentURL !== undefined) {
      for (const suffix of ['.ts', '/index.ts']) {
        const url = new URL(`${specifier}${suffix}`, context.parentURL);
        if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const mainModule = './repack-main.ts';
const { repack } = (await import(mainModule)) as { repack: typeof repackType };

process.exitCode = await repack(process.argv.slice(2)).catch((e: unknown) => {
  process.stderr.write(`repack: ${e instanceof Error ? e.message : String(e)}\n`);
  return 1;
});
