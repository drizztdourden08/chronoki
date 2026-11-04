/* @layer renderer-appshell @kind logic */
import { loadState } from '@app/game/save-states';
import { appLog } from '@app/log/app-log';
import { outcomeOf } from './outcome-of';
import { stateContext } from './state-context';

const loadFromSlot = async (slot: number): Promise<void> => {
  const ctx = stateContext();
  if (!ctx) return;
  appLog.info(`[state] load ${slot}: ${outcomeOf(await loadState(ctx, { kind: 'quick', slot }))}`);
};

export { loadFromSlot };
