/* @layer tooling-scripts @kind logic */
import { scenarioOf } from './scenario-args.mjs';

const USAGE = 'node --experimental-wasm-jspi scripts/headless-seed.mjs --pack <file> --seed <s> [--mode X] [--party a,b] [--option k=v]... [--frames N] [--expect-location <hex>] [--expect <addr>=<hex>[/<mask>] or <addr>!=<hex>]... [--poke <addr>=<hex>@<frame>]... [--expect-after <frames>] [--wasm <out dir>] [--json]';

const valueOf = (argv, flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

const optionValue = (text) => {
  if (text === 'true') return true;
  if (text === 'false') return false;
  return text !== '' && !Number.isNaN(Number(text)) ? Number(text) : text;
};

const optionsOf = (argv) => {
  const pairs = argv.flatMap((arg, i) => (arg === '--option' ? [argv[i + 1] ?? ''] : []));
  const entries = pairs.map((pair) => {
    const eq = pair.indexOf('=');
    if (eq < 1) throw new Error(`--option needs k=v, got "${pair}"`);
    return [pair.slice(0, eq), optionValue(pair.slice(eq + 1))];
  });
  const mode = valueOf(argv, '--mode');
  return Object.fromEntries([...(mode === undefined ? [] : [['gameMode', mode]]), ...entries]);
};

const parseArgs = (argv) => {
  const pack = valueOf(argv, '--pack');
  const seed = valueOf(argv, '--seed');
  if (pack === undefined || seed === undefined) throw new Error(`usage: ${USAGE}`);
  const party = valueOf(argv, '--party');
  return {
    pack,
    seed,
    options: optionsOf(argv),
    party: party === undefined ? null : party.split(',').map((id) => id.trim()),
    frames: Number(valueOf(argv, '--frames') ?? 4000),
    wasm: valueOf(argv, '--wasm'),
    scenario: scenarioOf(argv),
    json: argv.includes('--json'),
  };
};

export { parseArgs, USAGE };
