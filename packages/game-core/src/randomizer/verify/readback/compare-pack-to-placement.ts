/* @layer bridge-wasm @kind logic */
import { planPackPlacement } from '../../apply/plan-pack-placement';
import { deriveChestChecks } from '../../checks/derive-chest-checks';
import { deriveGiftChecks } from '../../checks/derive-gift-checks';
import type { CtPlacement } from '../../world/ct-placement.type';
import { compareChests } from './compare-chests';
import { compareGifts } from './compare-gifts';
import { compareStartBlock } from './compare-start-block';
import type { Mismatch, ReadbackOptions } from './readback.type';

const comparePackToPlacement = (pack: Uint8Array, placement: CtPlacement, options: ReadbackOptions = {}): Mismatch[] => {
  const checks = options.checks ?? [...deriveChestChecks(pack), ...deriveGiftChecks(pack)];
  const { pack: placed } = planPackPlacement(placement, checks);
  return [
    ...compareChests(pack, placed),
    ...compareGifts(pack, placed, checks),
    ...(options.startState ? compareStartBlock(pack, options.startState, options.party) : []),
  ];
};

export { comparePackToPlacement };
