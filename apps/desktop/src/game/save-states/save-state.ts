/* @layer bridge-wasm @kind logic */
import { saveMusicPosition } from '../msu-save-glue';
import { captureState } from './capture-state';
import { screenshotBytes } from './screenshot-bytes';
import type { SaveStateContext, StateResult } from './save-state.type';

const saveState = async (ctx: SaveStateContext, slot: number): Promise<StateResult> => {
  if (!ctx.profileId) return { ok: false, reason: 'no-profile' };
  const screenshot = await screenshotBytes(ctx.canvas);
  const captured = await captureState(ctx);
  if (!captured.ok) return captured;
  await ctx.store.slots.write(ctx.profileId, { kind: 'quick', slot }, { bytes: captured.bytes, screenshot });
  await saveMusicPosition(ctx.profileId, { kind: 'quick', slot });
  return { ok: true };
};

export { saveState };
