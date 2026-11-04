/* @layer renderer-components @kind logic */
import { REPLAN_RETRY_MS, REPLAN_SETTLE_MS } from '../GameLayer.constants';

const replanDelay = (deferredFrame: string | null, plannedFrame: string): number =>
  deferredFrame === plannedFrame ? REPLAN_RETRY_MS : REPLAN_SETTLE_MS;

export { replanDelay };
