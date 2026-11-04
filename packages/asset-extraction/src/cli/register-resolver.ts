/* @layer shared-asset-extraction @kind logic */
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
import { HAS_EXTENSION, SUFFIXES } from './register-resolver.constants';

const registerResolver = (): void => {
  registerHooks({
    resolve: (specifier, context, nextResolve) => {
      if (specifier.startsWith('.') && !HAS_EXTENSION.test(specifier) && context.parentURL !== undefined) {
        for (const suffix of SUFFIXES) {
          const url = new URL(`${specifier}${suffix}`, context.parentURL);
          if (existsSync(fileURLToPath(url))) return nextResolve(url.href, context);
        }
      }
      return nextResolve(specifier, context);
    },
  });
};

export { registerResolver };
