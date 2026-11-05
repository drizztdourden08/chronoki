/* @layer bridge-wasm @kind logic */
import type { FillBuild, FillPhase, World } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { PinnedItem } from './pinned-item.type';
import { PIN_SPOTS_PHASE_ID } from './pin-spots-phase.constants';

const pinSpotsPhase = (pins: readonly PinnedItem[]): FillPhase<FillBuild<World<CtWorldKeys>>> => ({
  id: PIN_SPOTS_PHASE_ID,
  run: ({ world }) => {
    pins.forEach(([location, item]) => world.placedItems.set(location, item));
  },
});

export { pinSpotsPhase };
