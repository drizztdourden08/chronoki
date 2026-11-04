/* @layer bridge-wasm @kind logic */
import type { NamedSaveKind } from '@drizztdourden08/brock-port-kit';
import { loadState } from './load-state';
import type { SaveStateContext, StateResult } from './save-state.type';

const loadNamedState = async (ctx: SaveStateContext, kind: NamedSaveKind, name: string): Promise<StateResult> => {
  if (!ctx.profileId) return { ok: false, reason: 'no-profile' };
  const entry = await ctx.store.named.find(ctx.profileId, kind, name);
  return entry ? loadState(ctx, { kind, id: entry.id }) : { ok: false, reason: 'missing' };
};

export { loadNamedState };
