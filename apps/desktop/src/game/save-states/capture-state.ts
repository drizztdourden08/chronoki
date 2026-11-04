/* @layer bridge-wasm @kind logic */
import { encodeSaveSlot } from '@drizztdourden08/brock-port-kit';
import { readStateBuffer } from '../state-buffers';
import { checkCaptureStamp } from '../state-stamp';
import { awaitState } from './await-state';
import { outcomeResult } from './outcome-result';
import type { Captured } from './capture-state.type';
import type { SaveStateContext } from './save-state.type';

const captureState = async (ctx: SaveStateContext): Promise<Captured> => {
  const { core, romFile } = ctx;
  const calls = core.calls();
  const { saveState } = core.definition.core.exports;
  if (!calls || !saveState) return { ok: false, reason: 'not-running' };
  if (!calls.number(saveState)) return { ok: false, reason: 'unavailable' };
  const outcome = await awaitState(calls);
  const outcomeFailure = outcomeResult(outcome);
  if (!outcomeFailure.ok) return outcomeFailure;
  const state = readStateBuffer(calls);
  if (!state) return { ok: false, reason: 'missing' };
  checkCaptureStamp(core, state);
  const meta = { port: core.definition.id, savedAt: Date.now(), rom: romFile };
  return { ok: true, bytes: encodeSaveSlot({ meta, state }) };
};

export { captureState };
