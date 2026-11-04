/* @layer bridge-wasm @kind logic */
import { hostGate } from '@chronoki/game-core';
import { appLog } from '@app/log/app-log';
import type { ActiveGame } from '../lifecycle/active-game.type';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { SAVE_ON_QUIT_GATE } from './auto-save.constants';
import { contextOfGame } from './context-of-game';
import { writeAutoState } from './write-auto-state';

const saveStateOnQuit = async (game: ActiveGame): Promise<void> => {
  if (!hostGate(SAVE_ON_QUIT_GATE) || chronokiCore.state().status !== 'running') return;
  const result = await writeAutoState(contextOfGame(game), 'Quit');
  appLog.info(`[save-on-quit] ${result.ok ? 'ok' : result.reason}`);
};

export { saveStateOnQuit };
