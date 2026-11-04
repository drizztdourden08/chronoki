/* @layer bridge-wasm @kind logic */
import { checkLoadable, engineStateOf } from '@chronoki/game-core';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { restoreMusicPosition } from '../msu-save-glue';
import { readCoreStamp } from '../state-stamp';
import { decodeStoredState } from './decode-stored-state';
import { pushState } from './push-state';
import { stateLoadedSignal } from './state-loaded-signal';
import type { SaveStateContext, StateResult } from './save-state.type';

const loadState = async (ctx: SaveStateContext, ref: SaveSlotRef): Promise<StateResult> => {
  const { core, store, profileId } = ctx;
  if (!profileId) return { ok: false, reason: 'no-profile' };
  if (core.state().status !== 'running' || !core.calls()) return { ok: false, reason: 'not-running' };
  const bytes = await store.slots.read(profileId, ref);
  if (!bytes) return { ok: false, reason: 'missing' };
  const stored = decodeStoredState(bytes, core.definition.id);
  const state = stored ? engineStateOf(stored) : null;
  if (!state) return { ok: false, reason: 'corrupt' };
  const verdict = checkLoadable(state, readCoreStamp(core));
  if (!verdict.ok) return { ok: false, reason: 'refused', message: verdict.message };
  const pushed = await pushState(core, state);
  if (pushed.ok) {
    await restoreMusicPosition(profileId, ref);
    stateLoadedSignal.emit();
  }
  return pushed;
};

export { loadState };
