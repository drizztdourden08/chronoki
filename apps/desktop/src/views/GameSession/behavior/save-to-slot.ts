/* @layer renderer-appshell @kind logic */
import { saveState } from '@app/game/save-states';
import { appLog } from '@app/log/app-log';
import { outcomeOf } from './outcome-of';
import { stateContext } from './state-context';

const saveToSlot = async (slot: number): Promise<void> => {
  const ctx = stateContext();
  if (!ctx) return;
  appLog.info(`[state] save ${slot}: ${outcomeOf(await saveState(ctx, slot))}`);
};

export { saveToSlot };
