// Boots a randomized seed headlessly in the wasm core and checks the in-game RAM.
// node --experimental-wasm-jspi scripts/headless-seed.mjs --pack <file> --seed <s> [--mode X] [--party a,b] [--option k=v]... [--frames N] [--wasm <out dir>] [--json]
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { parseArgs, USAGE } from './headless/parse-args.mjs';
import { runSeed } from './headless/run-seed.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultWasm = resolve(root, '../../core/wasm-build/out');

const server = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true },
});

let code = 1;
try {
  const args = parseArgs(process.argv.slice(2));
  const prepare = await server.ssrLoadModule('/src/randomizer/verify/headless/prepare-seed-pack.ts');
  const grants = await server.ssrLoadModule('/src/randomizer/verify/headless/create-headless-grants.ts');
  const legacy = await server.ssrLoadModule('/src/randomizer/apply/start-state/legacy-party.constants.ts');
  const mods = { prepareSeedPack: prepare.prepareSeedPack, createHeadlessGrants: grants.createHeadlessGrants, legacyParty: legacy.LEGACY_PARTY };
  const result = await runSeed(mods, args, resolve(args.wasm ?? defaultWasm));
  const failed = result.checks.filter((c) => !c.ok);
  if (args.json) console.log(JSON.stringify({ seed: args.seed, options: args.options, ...result }, null, 2));
  else {
    console.log(`seed ${args.seed} party ${result.party.join(',')} options ${JSON.stringify(args.options)}`);
    for (const c of result.checks) console.log(`${c.ok ? 'PASS' : 'FAIL'} ${c.name}: ${c.detail}`);
    console.log(failed.length === 0 ? 'ALL PASS' : `${failed.length} FAILED`);
  }
  code = failed.length === 0 ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (String(error?.message ?? '').startsWith('usage')) console.error(USAGE);
} finally {
  await server.close();
}
process.exit(code);
