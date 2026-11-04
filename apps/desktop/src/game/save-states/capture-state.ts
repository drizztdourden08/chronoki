/* @layer bridge-wasm @kind logic */
import { CT_STATE_APU_FILE, CT_STATE_FILE, encodeCkState } from '@chronoki/game-core';
import { encodeSaveSlot } from '@drizztdourden08/brock-port-kit';
import { awaitState } from './await-state';
import { removeDebugFiles } from './remove-debug-files';
import { NO_OPTIONS } from './capture-state.constants';
import type { Captured } from './capture-state.type';
import type { SaveStateContext } from './save-state.type';

const captureState = async (ctx: SaveStateContext): Promise<Captured> => {
  const { core, romFile } = ctx;
  const calls = core.calls();
  const fs = core.fs();
  const { saveState } = core.definition.core.exports;
  if (!calls || !fs || !saveState) return { ok: false, reason: 'not-running' };
  removeDebugFiles(fs);
  calls.call(saveState, core.definition.core.files.scratchSlot);
  const outcome = await awaitState(calls);
  if (outcome !== 'ok') {
    removeDebugFiles(fs);
    return { ok: false, reason: outcome === 'timeout' ? 'timeout' : 'failed' };
  }
  if (!fs.analyzePath(CT_STATE_FILE).exists || !fs.analyzePath(CT_STATE_APU_FILE).exists) {
    removeDebugFiles(fs);
    return { ok: false, reason: 'missing' };
  }
  const scene = fs.readFile(CT_STATE_FILE).slice();
  const apu = fs.readFile(CT_STATE_APU_FILE).slice();
  removeDebugFiles(fs);
  const state = encodeCkState({ scene, apu, options: NO_OPTIONS });
  const meta = { port: core.definition.id, savedAt: Date.now(), rom: romFile };
  return { ok: true, bytes: encodeSaveSlot({ meta, state }) };
};

export { captureState };
