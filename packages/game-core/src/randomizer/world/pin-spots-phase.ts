/* @layer bridge-wasm @kind logic */
import type { FillBuild, FillPhase, World } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { PinnedSpot } from './pinned-spot.type';
import { PIN_SPOTS_PHASE_ID } from './pin-spots-phase.constants';

const pinSpotsPhase = (pins: readonly PinnedSpot[]): FillPhase<FillBuild<World<CtWorldKeys>>> => ({
  id: PIN_SPOTS_PHASE_ID,
  run: ({ world }) => {
    pins.forEach(([spot, item]) => world.placedItems.set(spot, item));
  },
});

export { pinSpotsPhase };
