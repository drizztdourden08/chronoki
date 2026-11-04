/* @layer renderer-appshell @kind logic */
import type { FunctionAction } from '@chronoki/input-mapping';
import { loadState, saveState } from '@app/game/save-states';
import { outcomeOf } from './outcome-of';
import { currentSlot, cycleSlot } from './state-slot';
import { stateContext } from './state-context';

const runFunctionAction = async (action: FunctionAction): Promise<void> => {
  if (action === 'slot-next') cycleSlot(1);
  if (action === 'slot-prev') cycleSlot(-1);
  const ctx = stateContext();
  if (!ctx) return;
  const slot = currentSlot();
  if (action === 'save-state') console.info(`[state] save ${slot}: ${outcomeOf(await saveState(ctx, slot))}`);
  if (action === 'load-state') console.info(`[state] load ${slot}: ${outcomeOf(await loadState(ctx, { kind: 'quick', slot }))}`);
};

export { runFunctionAction };
