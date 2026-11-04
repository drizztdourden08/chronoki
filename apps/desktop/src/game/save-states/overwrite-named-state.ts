/* @layer bridge-wasm @kind logic */
import type { NamedSaveKind } from '@drizztdourden08/brock-port-kit';
import { captureState } from './capture-state';
import { isStateAvailable } from './is-state-available';
import { screenshotBytes } from './screenshot-bytes';
import type { SaveStateContext, StateResult } from './save-state.type';

const overwriteNamedState = async (ctx: SaveStateContext, kind: NamedSaveKind, id: string): Promise<StateResult> => {
  if (!ctx.profileId) return { ok: false, reason: 'no-profile' };
  if (!isStateAvailable(ctx.core)) return { ok: false, reason: 'unavailable' };
  const screenshot = await screenshotBytes(ctx.canvas);
  const captured = await captureState(ctx);
  if (!captured.ok) return captured;
  const entry = await ctx.store.named.overwrite(ctx.profileId, kind, id, { bytes: captured.bytes, screenshot });
  return entry ? { ok: true } : { ok: false, reason: 'missing' };
};

export { overwriteNamedState };
