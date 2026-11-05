/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { CtItem } from '../ct-world-keys.type';
import { treasureItemOf } from '../treasure-item-of';
import { TAB_FILLER_IDS, TAB_FILLER_STREAM } from './tab.constants';

const tabFillerOf = (count: number, seed: string): CtItem[] => {
  const rng = createRng(`${seed}${TAB_FILLER_STREAM}`);
  return Array.from({ length: Math.max(0, count) }, () =>
    treasureItemOf(TAB_FILLER_IDS[rng.int(TAB_FILLER_IDS.length)] ?? TAB_FILLER_IDS[0] ?? 0));
};

export { tabFillerOf };
