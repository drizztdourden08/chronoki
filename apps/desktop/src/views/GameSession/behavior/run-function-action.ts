/* @layer renderer-appshell @kind logic */
import { hostGate } from '@chronoki/game-core';
import type { FunctionAction } from '@chronoki/input-mapping';
import { loadState, saveState } from '@app/game/save-states';
import { setTurboHeld } from '@app/game/turbo';
import { appLog } from '@app/log/app-log';
import { FUNCTION_ACTION_GATES } from '../GameSession.constants';
import { currentSlot } from './current-slot';
import { cycleSlot } from './cycle-slot';
import { outcomeOf } from './outcome-of';
import { stateContext } from './state-context';

const runFunctionAction = async (action: FunctionAction): Promise<void> => {
  const gate = FUNCTION_ACTION_GATES[action];
  if (gate && !hostGate(gate)) return;
  if (action === 'fast-forward') setTurboHeld(true);
  if (action === 'slot-next') cycleSlot(1);
  if (action === 'slot-prev') cycleSlot(-1);
  const ctx = stateContext();
  if (!ctx) return;
  const slot = currentSlot();
  if (action === 'save-state') appLog.info(`[state] save ${slot}: ${outcomeOf(await saveState(ctx, slot))}`);
  if (action === 'load-state') appLog.info(`[state] load ${slot}: ${outcomeOf(await loadState(ctx, { kind: 'quick', slot }))}`);
};

export { runFunctionAction };
