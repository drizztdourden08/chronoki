/* @layer bridge-wasm @kind logic */
import { VERIFY_OPTION_SETS } from './verify-option-sets.constants';
import { verifyCtPlacement } from './verify-ct-placement';
import { verifyPartiesOf } from './verify-parties';
import type { CtStartParty } from '../world/party/ct-party.type';
import type { VerifyOptionSet } from './verify-option-set.type';
import type { VerifyFailure, VerifyResult, VerifySummary } from './verify-result.type';
import type { VerifySeedsRequest } from './verify-seeds.type';
import { verifySeedEndToEnd } from './verify-seed-end-to-end';
import { verifyInputOf } from './verify-synthetic-input';
import { VERIFY_DEFAULT_BASE, VERIFY_DEFAULT_SEEDS } from './verify.constants';

const seedsOf = (request: VerifySeedsRequest): readonly string[] =>
  request.seeds ?? Array.from({ length: request.count ?? VERIFY_DEFAULT_SEEDS },
    (_, n) => `${request.baseSeed ?? VERIFY_DEFAULT_BASE}-${n}`);

const runOne = (request: VerifySeedsRequest, optionSet: VerifyOptionSet, party: CtStartParty, seed: string): VerifyResult =>
  request.pack
    ? verifySeedEndToEnd(request.pack, optionSet.options, party, seed)
    : verifyCtPlacement(verifyInputOf(optionSet.options, party), seed);

const failureOf = (result: VerifyResult, optionSet: VerifyOptionSet, party: CtStartParty, seed: string): VerifyFailure => ({
  seed, optionSet: optionSet.name, party: party.join(','), sphere: result.stuckAt?.sphere,
  unreachable: result.stuckAt?.unreachable.length, error: result.error,
});

const failuresOf = (request: VerifySeedsRequest, optionSet: VerifyOptionSet, party: CtStartParty): { runs: number; failures: VerifyFailure[] } => {
  const seeds = seedsOf(request);
  const failures = seeds.flatMap((seed) => {
    const result = runOne(request, optionSet, party, seed);
    return result.ok ? [] : [failureOf(result, optionSet, party, seed)];
  });
  return { runs: seeds.length, failures };
};

const verifySeeds = (request: VerifySeedsRequest = {}): VerifySummary => {
  const parties = verifyPartiesOf(request.party ?? 'legacy');
  const failures: VerifyFailure[] = [];
  let runs = 0;
  for (const optionSet of request.optionSets ?? VERIFY_OPTION_SETS) {
    for (const party of parties) {
      const done = failuresOf(request, optionSet, party);
      runs += done.runs;
      failures.push(...done.failures);
    }
  }
  return { runs, passes: runs - failures.length, failures };
};

export { verifySeeds };
