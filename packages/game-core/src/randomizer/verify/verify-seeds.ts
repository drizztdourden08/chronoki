/* @layer bridge-wasm @kind logic */
import { VERIFY_OPTION_SETS } from './verify-option-sets.constants';
import { verifyCtPlacement } from './verify-ct-placement';
import { verifyPartiesOf } from './verify-parties';
import type { VerifyFailure, VerifySummary } from './verify-result.type';
import type { VerifySeedsRequest } from './verify-seeds.type';
import { verifyInputOf } from './verify-synthetic-input';
import { VERIFY_DEFAULT_BASE, VERIFY_DEFAULT_SEEDS } from './verify.constants';

const seedsOf = (request: VerifySeedsRequest): readonly string[] =>
  request.seeds ?? Array.from({ length: request.count ?? VERIFY_DEFAULT_SEEDS },
    (_, n) => `${request.baseSeed ?? VERIFY_DEFAULT_BASE}-${n}`);

const verifySeeds = (request: VerifySeedsRequest = {}): VerifySummary => {
  const parties = verifyPartiesOf(request.party ?? 'legacy');
  const failures: VerifyFailure[] = [];
  let runs = 0;
  for (const optionSet of request.optionSets ?? VERIFY_OPTION_SETS) {
    for (const party of parties) {
      for (const seed of seedsOf(request)) {
        runs += 1;
        const result = verifyCtPlacement(verifyInputOf(optionSet.options, party), seed);
        if (result.ok) continue;
        failures.push({
          seed, optionSet: optionSet.name, party: party.join(','), sphere: result.stuckAt?.sphere,
          unreachable: result.stuckAt?.unreachable.length, error: result.error,
        });
      }
    }
  }
  return { runs, passes: runs - failures.length, failures };
};

export { verifySeeds };
