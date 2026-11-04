/* @layer bridge-wasm @kind logic */
import { saveNamedState } from '../save-states/save-named-state';
import type { SaveStateContext, StateResult } from '../save-states/save-state.type';
import { AUTO_SAVE_KEEP } from './auto-save.constants';

const writeAutoState = async (ctx: SaveStateContext, label: string): Promise<StateResult> => {
  const result = await saveNamedState(ctx, 'auto', `${label} ${new Date().toLocaleString()}`);
  if (result.ok && ctx.profileId) await ctx.store.named.prune(ctx.profileId, 'auto', { keep: AUTO_SAVE_KEEP });
  return result;
};

export { writeAutoState };
