/* @layer bridge-wasm @kind logic */
import type { NamedSaveKind } from '@drizztdourden08/brock-port-kit';
import { captureState } from './capture-state';
import { screenshotBytes } from './screenshot-bytes';
import type { SaveStateContext, StateResult } from './save-state.type';

const saveNamedState = async (ctx: SaveStateContext, kind: NamedSaveKind, name: string): Promise<StateResult> => {
  if (!ctx.profileId) return { ok: false, reason: 'no-profile' };
  const screenshot = await screenshotBytes(ctx.canvas);
  const captured = await captureState(ctx);
  if (!captured.ok) return captured;
  await ctx.store.named.create(ctx.profileId, kind, name, { bytes: captured.bytes, screenshot });
  return { ok: true };
};

export { saveNamedState };
