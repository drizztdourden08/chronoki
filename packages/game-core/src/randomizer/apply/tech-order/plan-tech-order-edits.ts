/* @layer bridge-wasm @kind logic */
import { createRomSpace } from './create-rom-space';
import { createRomStage } from './create-rom-stage';
import { planLearnReqEdits } from './plan-learn-req-edits';
import { planMenuMpEdits } from './plan-menu-mp-edits';
import { planMenuTableEdits } from './plan-menu-table-edits';
import { planSlotPermutations } from './plan-slot-permutations';
import { planTechRecordMoves } from './plan-tech-record-moves';
import { techIdMapsOf } from './tech-id-maps-of';
import type { TechOrderMode, TechOrderPlan } from './tech-order.type';

const planTechOrderEdits = (pack: Uint8Array, mode: TechOrderMode, seed: string): TechOrderPlan => {
  const maps = techIdMapsOf(planSlotPermutations(mode, seed));
  const space = createRomSpace(pack);
  const stage = createRomStage(pack, space);
  const menu = planMenuTableEdits(pack, maps);
  const failed = [
    ...planTechRecordMoves(space, stage, maps),
    ...planLearnReqEdits(space, stage, maps),
    ...planMenuMpEdits(space, stage, maps),
    ...menu.failed,
  ];
  return { edits: failed.length > 0 ? [] : [...stage.edits(), ...menu.edits], failed };
};

export { planTechOrderEdits };
