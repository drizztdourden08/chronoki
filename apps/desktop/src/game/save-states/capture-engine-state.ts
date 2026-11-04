/* @layer bridge-wasm @kind logic */
import { readStateBuffer } from '../state-buffers';
import { checkCaptureStamp } from '../state-stamp';
import { awaitState } from './await-state';
import { outcomeResult } from './outcome-result';
import type { EngineCaptured } from './capture-state.type';
import type { SaveStateContext } from './save-state.type';

const captureEngineState = async ({ core }: Pick<SaveStateContext, 'core'>): Promise<EngineCaptured> => {
  const calls = core.calls();
  const { saveState } = core.definition.core.exports;
  if (!calls || !saveState) return { ok: false, reason: 'not-running' };
  if (!calls.number(saveState)) return { ok: false, reason: 'unavailable' };
  const outcomeFailure = outcomeResult(await awaitState(calls));
  if (!outcomeFailure.ok) return outcomeFailure;
  const state = readStateBuffer(calls);
  if (!state) return { ok: false, reason: 'missing' };
  checkCaptureStamp(core, state);
  return { ok: true, state };
};

export { captureEngineState };
