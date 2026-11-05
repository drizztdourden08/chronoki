/* @layer bridge-wasm @kind logic */
import { VERIFY_OPTION_SETS } from './verify-option-sets.constants';
import type { VerifySeedsRequest } from './verify-seeds.type';
import { VERIFY_DEFAULT_BASE, VERIFY_DEFAULT_SEEDS } from './verify.constants';

type VerifyCliArgs = { request: VerifySeedsRequest; json: boolean };

const valueOf = (argv: readonly string[], flag: string): string | undefined => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

const parseVerifyArgs = (argv: readonly string[]): VerifyCliArgs => {
  const mode = valueOf(argv, '--mode');
  const optionSets = mode === undefined
    ? VERIFY_OPTION_SETS
    : VERIFY_OPTION_SETS.filter((set) => set.name === mode || set.name === `mode:${mode}`);
  if (optionSets.length === 0) throw new Error(`unknown --mode ${String(mode)}; known: ${VERIFY_OPTION_SETS.map((set) => set.name).join(', ')}`);
  const party = valueOf(argv, '--party');
  return {
    json: argv.includes('--json'),
    request: {
      count: Number(valueOf(argv, '--seeds') ?? VERIFY_DEFAULT_SEEDS),
      baseSeed: valueOf(argv, '--base') ?? VERIFY_DEFAULT_BASE,
      optionSets,
      party: party === 'all' || party === 'all-subsets' ? 'all-subsets' : 'legacy',
    },
  };
};

export { parseVerifyArgs };
export type { VerifyCliArgs };
