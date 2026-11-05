/* @layer bridge-wasm @kind logic */
import { OP_ADD_ITEM } from '../checks/gift-ops.constants';
import { SPOT_GIFTS } from '../checks/spot-gifts.constants';
import type { CtSpotId } from '../world/ct-world-keys.type';
import { MAX_AWARD_ITEM } from './apply.constants';
import type { Placement } from './apply-seed.type';
import { opEquals } from './modes/op-equals';
import type { SpotGiftPlan } from './spot-gift-plan.type';

const planSpotGiftSplices = (placement: Placement, spots: readonly CtSpotId[] = []): SpotGiftPlan => {
  const plan: SpotGiftPlan = { splices: [], failed: [] };
  SPOT_GIFTS.filter((gift) => spots.includes(gift.spot)).forEach((gift) => {
    const item = placement[gift.spot];
    if (item === undefined) return;
    if (item < 1 || item > MAX_AWARD_ITEM) {
      plan.failed.push(gift.spot);
      return;
    }
    plan.splices.push({
      scene: gift.scene,
      anchor: opEquals(gift.anchor),
      replace: Uint8Array.from([...gift.anchor, OP_ADD_ITEM, item]),
      why: gift.why,
    });
  });
  return plan;
};

export { planSpotGiftSplices };
