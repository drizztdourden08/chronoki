/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { FILLER_DEFAULT_SEED, FILLER_STREAM } from './pool-filler.constants';
import { isCtKeyItem } from './is-ct-key-item';
import type { CtItem } from './ct-world-keys.type';

const poolFillerOf = (
  rest: readonly CtItem[], spotCount: number, keyItemCount: number, seed: string = FILLER_DEFAULT_SEED,
): CtItem[] => {
  const source = rest.filter((item) => !isCtKeyItem(item));
  const missing = Math.max(0, spotCount - keyItemCount);
  if (source.length === 0 || missing === 0) return [];
  const rng = createRng(`${seed}${FILLER_STREAM}`);
  const filler: CtItem[] = [];
  while (filler.length < missing) filler.push(...rng.shuffle(source));
  return filler.slice(0, missing);
};

export { poolFillerOf };
