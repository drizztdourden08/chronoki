/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';
import { LOCATION_ID, LOCATION_MASK } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { readInventoryCounts } from './read-inventory-counts';
import type { GiftTarget, GiftWatch } from './watch.type';

const gainsOf = (now: ReadonlyMap<number, number>, before: ReadonlyMap<number, number>): Map<number, number> =>
  new Map([...now].map(([item, count]): [number, number] => [item, count - (before.get(item) ?? 0)]));

const createGiftWatch = (targets: readonly GiftTarget[]): GiftWatch => {
  const wanted = new Set(targets.map((target) => target.item));
  const collected = new Set<string>();
  let last: ReadonlyMap<number, number> | null = null;

  const observe = (view: MemoryView): void => {
    const counts = readInventoryCounts(view, wanted);
    if (last !== null) {
      const here = view.word(CT_WRAM_REGION, LOCATION_ID) & LOCATION_MASK;
      const gains = gainsOf(counts, last);
      for (const target of targets) {
        const gained = gains.get(target.item) ?? 0;
        if (collected.has(target.id) || target.locationId !== here || gained <= 0) continue;
        collected.add(target.id);
        gains.set(target.item, gained - 1);
      }
    }
    last = counts;
  };

  return {
    observe,
    reset: () => {
      last = null;
    },
    completed: () => collected,
  };
};

export { createGiftWatch };
