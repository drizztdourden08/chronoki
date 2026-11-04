/* @layer shared-asset-extraction @kind logic */
// The importer's sources import each other without file extensions (a bundler resolves them); Node's type stripping
// does not. This launcher installs a resolver for relative extensionless specifiers, then runs the CLI.
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

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

const { repack } = await import('./repack-main.ts');

process.exitCode = await repack(process.argv.slice(2)).catch((e: unknown) => {
  console.error(`repack: ${e instanceof Error ? e.message : String(e)}`);
  return 1;
});
