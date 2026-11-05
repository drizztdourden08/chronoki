/* @layer renderer-appshell @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { loadState } from '@app/game/save-states';
import type { SaveStateContext, StateResult } from '@app/game/save-states';
import { peekInputManager } from '@app/input/input-manager/peek-input-manager';

const loadIntoPlay = async (ctx: SaveStateContext, ref: SaveSlotRef): Promise<StateResult> => {
  peekInputManager()?.resume();
  const result = await loadState(ctx, ref);
  if (result.ok) nav.close();
  return result;
};

export { loadIntoPlay };
