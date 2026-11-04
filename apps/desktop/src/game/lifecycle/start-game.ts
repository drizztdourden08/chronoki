/* @layer bridge-wasm @kind logic */
import { createSaveStore } from '@drizztdourden08/brock-port-kit';
import { ctSaveCompanions } from '@chronoki/game-core';
import { provideChronokiGameInfo } from '../game-info';
import { activeGameHolder } from './active-game-holder';
import { bootGameModule } from './boot-game-module';
import { startSessionServices } from './start-session-services';
import type { StartGameRequest } from './start-game.type';
import { stopGame } from './stop-game';

const startGame = async (request: StartGameRequest): Promise<boolean> => {
  if (activeGameHolder.current) await stopGame();
  const store = createSaveStore(request.files, { companions: ctSaveCompanions });
  const session = await bootGameModule(request, store);
  if (!session) return false;
  const { canvas, romFile, profileId } = request;
  const unsubscribePause = startSessionServices({ store, profileId });
  activeGameHolder.current = { session, store, files: request.files, canvas, romFile, profileId, unsubscribePause };
  provideChronokiGameInfo();
  canvas.focus();
  return true;
};

export { startGame };
