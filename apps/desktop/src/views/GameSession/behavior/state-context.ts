/* @layer renderer-appshell @kind logic */
import { activeGameHolder, chronokiCore } from '@app/game/lifecycle';
import type { SaveStateContext } from '@app/game/save-states';

const stateContext = (): SaveStateContext | null => {
  const game = activeGameHolder.current;
  if (!game) return null;
  return { core: chronokiCore, store: game.store, canvas: game.canvas, romFile: game.romFile, profileId: game.profileId };
};

export { stateContext };
