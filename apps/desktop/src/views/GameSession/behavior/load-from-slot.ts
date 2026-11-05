/* @layer renderer-appshell @kind logic */
import { appLog } from '@app/log/app-log';
import { loadIntoPlay } from './load-into-play';
import { outcomeOf } from './outcome-of';
import { stateContext } from './state-context';

const loadFromSlot = async (slot: number): Promise<void> => {
  const ctx = stateContext();
  if (!ctx) return;
  appLog.info(`[state] load ${slot}: ${outcomeOf(await loadIntoPlay(ctx, { kind: 'quick', slot }))}`);
};

export { loadFromSlot };
