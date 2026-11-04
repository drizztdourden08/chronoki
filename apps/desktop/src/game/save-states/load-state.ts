/* @layer bridge-wasm @kind logic */
import { CT_STATE_APU_FILE, CT_STATE_FILE } from '@chronoki/game-core';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { awaitState } from './await-state';
import { decodeStoredState } from './decode-stored-state';
import { isStateAvailable } from './is-state-available';
import { outcomeResult } from './outcome-result';
import { removeDebugFiles } from './remove-debug-files';
import type { SaveStateContext, StateResult } from './save-state.type';

const loadState = async (ctx: SaveStateContext, ref: SaveSlotRef): Promise<StateResult> => {
  const { core, store, profileId } = ctx;
  if (!profileId) return { ok: false, reason: 'no-profile' };
  if (!isStateAvailable(core)) return { ok: false, reason: 'unavailable' };
  const calls = core.calls();
  const fs = core.fs();
  const { loadState: loadExport } = core.definition.core.exports;
  if (!calls || !fs || !loadExport) return { ok: false, reason: 'not-running' };
  const bytes = await store.slots.read(profileId, ref);
  if (!bytes) return { ok: false, reason: 'missing' };
  const parts = decodeStoredState(bytes, core.definition.id);
  if (!parts) return { ok: false, reason: 'corrupt' };
  removeDebugFiles(fs);
  fs.writeFile(CT_STATE_FILE, parts.scene);
  fs.writeFile(CT_STATE_APU_FILE, parts.apu);
  calls.call(loadExport, core.definition.core.files.scratchSlot);
  const outcome = await awaitState(calls);
  removeDebugFiles(fs);
  return outcomeResult(outcome);
};

export { loadState };
