/* @layer bridge-wasm @kind logic */
import type { ScoutedInput } from '@drizztdourden08/brock-randomizer/archipelago';
import type { CtPlacement } from '../world/ct-placement.type';
import { duplicateFlagOf } from '../world/duplicate-flag-of';
import { rollMysteryOptions } from '../world/mystery/roll-mystery-options';
import { rollCtNonItem } from '../world/roll-ct-non-item';
import { ctApIds } from './ct-ap-ids';
import type { CtSlotData } from './ct-slot-data.type';
import { FOREIGN_ITEM_KEY } from './foreign-item.constants';

const itemKeyOf = (scout: ScoutedInput['scouted'][number], slot: number): string | undefined =>
  scout.player === slot ? ctApIds.itemKeyOf(scout.item) : FOREIGN_ITEM_KEY;

const ctPlacementOfScouts = (slotData: CtSlotData, input: ScoutedInput): CtPlacement => {
  const { options, startParty, bosses, characters, elements, objectives } = rollCtNonItem({ checks: [], options: slotData.options }, slotData.seed);
  const locations = input.scouted.flatMap((scout): [string, string][] => {
    const location = scout.locationKey || ctApIds.locationKeyOf(scout.location);
    const item = itemKeyOf(scout, input.slot);
    return location === undefined || item === undefined ? [] : [[location, item]];
  });
  return {
    seed: slotData.seed, attempts: 1, locations, spheres: [],
    startParty,
    ...(bosses === undefined ? {} : { bosses }),
    ...(characters === undefined ? {} : { characters }),
    ...duplicateFlagOf(options, characters),
    ...(elements === undefined ? {} : { elements }),
    ...(objectives === undefined ? {} : { objectives }),
    ...(options.mysterySeed === true ? { mystery: rollMysteryOptions(slotData.seed) } : {}),
  } as CtPlacement;
};

export { ctPlacementOfScouts };
