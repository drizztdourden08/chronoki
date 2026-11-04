/* @layer renderer-appshell @kind logic */
import { loadNamedState, loadState } from '@app/game/save-states';
import type { StateResult } from '@app/game/save-states';
import type { TestArgs } from '@app/ipc';
import { SETTLE_AFTER_STATE_MS } from '../GameSession.constants';
import { outcomeOf } from './outcome-of';
import { stateContext } from './state-context';

const loadAutoState = async (autoState: number | string): Promise<StateResult> => {
  const ctx = stateContext();
  if (!ctx) return { ok: false, reason: 'not-running' };
  return typeof autoState === 'number'
    ? loadState(ctx, { kind: 'quick', slot: autoState })
    : loadNamedState(ctx, 'normal', autoState);
};

const settleAutoState = async (args: TestArgs): Promise<void> => {
  if (args.autoState === null) return;
  const result = await loadAutoState(args.autoState);
  console.info(`[auto-state] ${String(args.autoState)}: ${outcomeOf(result)}`);
  await new Promise((resolve) => { setTimeout(resolve, SETTLE_AFTER_STATE_MS); });
};

export { settleAutoState };
