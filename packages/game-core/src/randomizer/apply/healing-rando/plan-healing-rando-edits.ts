/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { HEAL_BAND } from '../band-rando/band-rando.constants';
import { groupSlotsBy } from '../band-rando/group-slots-by';
import { rankKeptValuesOf } from '../band-rando/rank-kept-values-of';
import { createRomSpace } from '../tech-order/create-rom-space';
import { createRomStage } from '../tech-order/create-rom-stage';
import { namedTableOf } from '../tech-order/named-table-of';
import {
  HEAL_AMOUNT_LIMIT, HEAL_AMOUNT_TABLE, HEAL_BASE_LIMIT, HEAL_FIRST_ID, HEAL_KIND_TABLE, HEAL_RECORD_BASE_AT, HEALING_RANDO_STREAM,
} from './healing-rando.constants';
import { readHealSlots } from './read-heal-slots';

const fieldAmountEdits = (pack: Uint8Array, at: number, amount: number, why: string): PackEdit[] =>
  [amount & 0xff, amount >> 8]
    .map((next, i) => ({ at: at + i, old: pack[at + i] ?? 0, next, why }))
    .filter((edit) => edit.old !== edit.next);

const planHealingRandoEdits = (pack: Uint8Array, seed: string): EditPlan => {
  const kinds = namedTableOf(pack, HEAL_KIND_TABLE);
  const amounts = namedTableOf(pack, HEAL_AMOUNT_TABLE);
  if (kinds === null || amounts === null) return { edits: [], failed: ['healing-rando: the item effect tables are not in the pack'] };
  const space = createRomSpace(pack);
  const stage = createRomStage(pack, space);
  const rng = createRng(`${seed}${HEALING_RANDO_STREAM}`);
  const fieldEdits: PackEdit[] = [];
  groupSlotsBy(readHealSlots(pack, space, kinds, amounts), (slot) => String(slot.kind)).forEach((group) => {
    const wanted = rankKeptValuesOf(group.map((slot) => slot.amount), HEAL_BAND, group.map(() => rng.next()), HEAL_AMOUNT_LIMIT);
    group.forEach((slot, i) => {
      const why = `healing-rando: item ${(HEAL_FIRST_ID + slot.index).toString(16)}`;
      const base = Math.min(HEAL_BASE_LIMIT, Math.max(1, Math.round((wanted[i] ?? slot.amount) / slot.mult)));
      stage.put(slot.record + HEAL_RECORD_BASE_AT, base, why);
      fieldEdits.push(...fieldAmountEdits(pack, amounts.at + slot.index * 2, base * slot.mult, why));
    });
  });
  return { edits: [...stage.edits(), ...fieldEdits], failed: [] };
};

export { planHealingRandoEdits };
