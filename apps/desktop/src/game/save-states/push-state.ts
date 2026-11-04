/* @layer bridge-wasm @kind logic */
import type { CkSettings } from '@chronoki/game-core';
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';
import { writeStateInput } from '../state-buffers';
import { awaitState } from './await-state';
import { ENGINE_REFUSAL_FALLBACK, ENGINE_REFUSAL_MESSAGES } from './engine-refusal.constants';
import { outcomeResult } from './outcome-result';
import { EXPORT_STATE_REASON } from './state-status.constants';
import type { StateResult } from './save-state.type';

const pushState = async (core: GameCore<CkSettings>, state: Uint8Array): Promise<StateResult> => {
  const calls = core.calls();
  const { loadState } = core.definition.core.exports;
  if (!calls || !loadState) return { ok: false, reason: 'not-running' };
  const ptr = writeStateInput(calls, state);
  if (!ptr) return { ok: false, reason: 'failed' };
  if (!calls.number(loadState, ptr, state.length)) {
    const message = ENGINE_REFUSAL_MESSAGES[calls.number(EXPORT_STATE_REASON)] ?? ENGINE_REFUSAL_FALLBACK;
    return { ok: false, reason: 'refused', message };
  }
  return outcomeResult(await awaitState(calls));
};

export { pushState };
