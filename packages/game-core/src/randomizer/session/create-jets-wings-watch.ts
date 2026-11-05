/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import {
  EPOCH_BOARDED_AT, EPOCH_STATE_ADDRESSES, EPOCH_STATE_WINGED, EPOCH_WINGS_BIT, JETS_ITEM_ID, LOCATION_ID, LOCATION_MASK,
  LOCATION_OVERWORLD_FIRST, LOCATION_OVERWORLD_LAST,
} from './jets-wings.constants';
import type { ModeHook } from './mode-hook.type';
import { readInventoryCounts } from './read-inventory-counts';
import type { WramWrite } from './start-gold-grant.type';

const JETS_ONLY: ReadonlySet<number> = new Set([JETS_ITEM_ID]);

const onOverworld = (view: MemoryView): boolean => {
  const location = view.word(CT_WRAM_REGION, LOCATION_ID) & LOCATION_MASK;
  return location >= LOCATION_OVERWORLD_FIRST && location <= LOCATION_OVERWORLD_LAST;
};

const grantWings = (view: MemoryView, write: WramWrite): boolean =>
  write(EPOCH_BOARDED_AT, Uint8Array.of(view.byte(CT_WRAM_REGION, EPOCH_BOARDED_AT) | EPOCH_WINGS_BIT))
  && EPOCH_STATE_ADDRESSES.every((at) => write(at, Uint8Array.of(EPOCH_STATE_WINGED)));

const createJetsWingsWatch = (write: WramWrite): ModeHook => {
  let granted = false;
  return {
    observe: (view: MemoryView, started: boolean): void => {
      if (!started || granted || onOverworld(view)) return;
      if ((readInventoryCounts(view, JETS_ONLY).get(JETS_ITEM_ID) ?? 0) === 0) return;
      granted = grantWings(view, write);
    },
    goalReached: () => false,
    reset: () => {
      granted = false;
    },
  };
};

export { createJetsWingsWatch };
