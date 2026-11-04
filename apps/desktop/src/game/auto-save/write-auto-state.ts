/* @layer bridge-wasm @kind logic */
import { saveNamedState } from '../save-states/save-named-state';
import type { SaveStateContext, StateResult } from '../save-states/save-state.type';
import { autoSaveConfig } from './auto-save-config';
import type { AutoTrigger } from './auto-save.type';

const writeAutoState = async (ctx: SaveStateContext, trigger: AutoTrigger): Promise<StateResult> => {
  const result = await saveNamedState(ctx, 'auto', `${trigger} ${new Date().toISOString()}`);
  if (result.ok && ctx.profileId) await ctx.store.named.prune(ctx.profileId, 'auto', { keep: autoSaveConfig.maxEntries });
  return result;
};

export { writeAutoState };
