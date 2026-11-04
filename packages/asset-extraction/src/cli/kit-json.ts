/* @layer shared-asset-extraction @kind logic */
import type { registerResolver as registerResolverType } from './register-resolver';
import type { kitJson as kitJsonType } from './kit-json-main';

const resolverModule = './register-resolver.ts';
const { registerResolver } = (await import(resolverModule)) as { registerResolver: typeof registerResolverType };
registerResolver();

const mainModule = './kit-json-main.ts';
const { kitJson } = (await import(mainModule)) as { kitJson: typeof kitJsonType };

process.exitCode = await kitJson(process.argv.slice(2)).catch((e: unknown) => {
  process.stderr.write(`kit-json: ${e instanceof Error ? e.message : String(e)}\n`);
  return 1;
});
