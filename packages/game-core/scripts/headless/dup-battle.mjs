/* @layer tooling-scripts @kind logic */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { pointWarpAtForest } from './battle-entry.mjs';
import { seatText, sheetText } from './battle-read.mjs';
import { runBattle } from './run-battle.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const defaultWasm = resolve(root, '../../core/wasm-build/out');
const USAGE = 'dup-battle.mjs --pack <ct.dat> --seed <s> [--party a,b] [--gate] [--no-dup] [--tech] [--tp N] [--frames N] [--wasm dir] [--json]';

const valueOf = (argv, flag) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
};

const parse = (argv) => {
  const pack = valueOf(argv, '--pack'), seed = valueOf(argv, '--seed');
  if (pack === undefined || seed === undefined) throw new Error(`usage: ${USAGE}`);
  const dup = !argv.includes('--no-dup');
  return {
    pack, seed,
    party: (valueOf(argv, '--party') ?? 'crono,frog').split(','),
    options: { epochFail: true, characterRando: true, ...(dup ? { duplicateCharacters: true } : {}) },
    gate: argv.includes('--gate'), tech: argv.includes('--tech'),
    tpOwed: Number(valueOf(argv, '--tp') ?? 1), frames: Number(valueOf(argv, '--frames') ?? 4000), tail: 300,
    wasm: valueOf(argv, '--wasm'), json: argv.includes('--json'),
  };
};

const print = (args, r) => {
  if (args.json) { console.log(JSON.stringify(r, null, 2)); return; }
  console.log(`seed ${args.seed} gate ${args.gate ? 'on' : 'off'} dup ${'duplicateCharacters' in args.options} party ${r.partyIds.join(',')} battle at ${r.battleAt} lasted ${r.battleFrames}`);
  for (const s of r.primed) console.log(`primed ${sheetText(s)}`);
  for (const s of r.seats) console.log(`in battle ${seatText(s)}`);
  for (const a of r.actions) console.log(`action ${a}`);
  for (const a of r.attacks) console.log(a);
  for (const c of r.casts) console.log(`tech confirmed d${c.frame} seat${c.seat} tech ${c.tech}`);
  for (const s of r.after) console.log(`after ${sheetText(s)}`);
};

const server = await createServer({ root, appType: 'custom', logLevel: 'error', server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true } });
let code = 1;
try {
  const args = parse(process.argv.slice(2));
  const warp = await server.ssrLoadModule('/src/randomizer/apply/start-state/epoch-fail-start.constants.ts');
  pointWarpAtForest(warp.EPOCH_FAIL_WARP);
  const prepare = await server.ssrLoadModule('/src/randomizer/verify/headless/prepare-seed-pack.ts');
  const grants = await server.ssrLoadModule('/src/randomizer/verify/headless/create-headless-grants.ts');
  const report = await runBattle({ prepareSeedPack: prepare.prepareSeedPack, createHeadlessGrants: grants.createHeadlessGrants }, args, resolve(args.wasm ?? defaultWasm));
  print(args, report);
  code = report.battleAt >= 0 && report.battleFrames >= 0 ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  await server.close();
}
process.exit(code);
