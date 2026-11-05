/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CtOptionValues } from '../ct-world-input.type';
import { effectiveOptionsOf } from '../modes/effective-options-of';
import type { CtStartParty } from '../party/ct-party.type';
import { bucketCountsOf } from './bucket-counts-of';
import { OBJECTIVES_STREAM } from './bucket.constants';
import { eligibleObjectivesOf } from './eligible-objectives-of';
import type { ObjectiveDef } from './objective-def.type';

const objectivesOf = (options: CtOptionValues | undefined, seed: string, party: CtStartParty): ObjectiveDef[] => {
  const effective = effectiveOptionsOf(options);
  if (effective.bucketList !== true) return [];
  const eligible = eligibleObjectivesOf(effective, party);
  const { count } = bucketCountsOf(effective, eligible.length);
  return createRng(`${seed}${OBJECTIVES_STREAM}`).shuffle(eligible).slice(0, count);
};

export { objectivesOf };
