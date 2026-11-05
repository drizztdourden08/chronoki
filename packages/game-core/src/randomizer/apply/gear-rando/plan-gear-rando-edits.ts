/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { EditPlan } from '../apply-seed.type';
import { BYTE_MAX, GEAR_BAND } from '../band-rando/band-rando.constants';
import { groupSlotsBy } from '../band-rando/group-slots-by';
import { rankKeptValuesOf } from '../band-rando/rank-kept-values-of';
import { createRomSpace } from '../tech-order/create-rom-space';
import { createRomStage } from '../tech-order/create-rom-stage';
import { GEAR_RANDO_STREAM } from './gear-rando.constants';
import { readGearSlots } from './read-gear-slots';

const planGearRandoEdits = (pack: Uint8Array, seed: string): EditPlan => {
  const space = createRomSpace(pack);
  const stage = createRomStage(pack, space);
  const rng = createRng(`${seed}${GEAR_RANDO_STREAM}`);
  groupSlotsBy(readGearSlots(pack, space), (slot) => slot.group).forEach((group) => {
    const next = rankKeptValuesOf(group.map((slot) => slot.value), GEAR_BAND, group.map(() => rng.next()), BYTE_MAX);
    group.forEach((slot, i) => stage.put(slot.addr, next[i] ?? slot.value, `gear-rando: item ${slot.id.toString(16)}`));
  });
  return { edits: stage.edits(), failed: [] };
};

export { planGearRandoEdits };
