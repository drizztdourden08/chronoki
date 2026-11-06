/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { AP_WORLD_VERSION, ctPlacementOfScouts, parseCtSlotData } from '@chronoki/game-core/archipelago';
import { chronokiApCurrentSlot } from './chronoki-ap-current-slot';

const chronokiApSlot: ArchipelagoGame<CtPlacement, unknown>['slot'] = (raw) => {
  const parsed = parseCtSlotData(raw);
  if (parsed.kind !== 'ok') return parsed;
  const { data } = parsed;
  return {
    kind: 'ok',
    deathLink: data.deathLink,
    version: AP_WORLD_VERSION,
    placement: (input) => {
      chronokiApCurrentSlot.set(input.slot);
      return ctPlacementOfScouts(data, input);
    },
  };
};

export { chronokiApSlot };
