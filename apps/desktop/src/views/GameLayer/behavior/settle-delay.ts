/* @layer renderer-components @kind logic */
import { STAGE_SETTLE_MAX_MS, STAGE_SETTLE_MS } from '../GameLayer.constants';
import type { SettleState } from '../GameLayer.type';

const settleDelay = ({ elapsed, fullscreenPending }: SettleState): number => {
  const left = Math.max(0, STAGE_SETTLE_MAX_MS - elapsed);
  return fullscreenPending ? left : Math.min(STAGE_SETTLE_MS, left);
};

export { settleDelay };
