/* @layer renderer-components @kind logic */
import { REPLAN_MODES } from '../GameLayer.constants';
import type { ReplanInputs, ReplanVerdict } from '../GameLayer.type';

const replanDecision = ({ live, busy, runningFrame, plannedFrame, blockedFrame, savable, mode }: ReplanInputs): ReplanVerdict => {
  if (!live || busy || runningFrame === plannedFrame || plannedFrame === blockedFrame) return 'idle';
  return savable && mode !== null && REPLAN_MODES.includes(mode) ? 'replan' : 'defer';
};

export { replanDecision };
