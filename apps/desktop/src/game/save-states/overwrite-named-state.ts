/* @layer bridge-wasm @kind logic */
import type { NamedSaveKind } from '@drizztdourden08/brock-port-kit';
import { saveMusicPosition } from '../msu-save-glue';
import { captureState } from './capture-state';
import { screenshotBytes } from './screenshot-bytes';
import type { SaveStateContext, StateResult } from './save-state.type';

const overwriteNamedState = async (ctx: SaveStateContext, kind: NamedSaveKind, id: string): Promise<StateResult> => {
  if (!ctx.profileId) return { ok: false, reason: 'no-profile' };
  const screenshot = await screenshotBytes(ctx.canvas);
  const captured = await captureState(ctx);
  if (!captured.ok) return captured;
  const entry = await ctx.store.named.overwrite(ctx.profileId, kind, id, { bytes: captured.bytes, screenshot });
  if (!entry) return { ok: false, reason: 'missing' };
  await saveMusicPosition(ctx.profileId, { kind, id });
  return { ok: true };
};

export { overwriteNamedState };
