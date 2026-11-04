/* @layer bridge-wasm @kind logic */
import { hostGate } from '@chronoki/game-core';
import { appLog } from '@app/log/app-log';
import { activeGameHolder } from '../lifecycle/active-game-holder';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { AUTO_SAVE_GATE } from './auto-save.constants';
import { contextOfGame } from './context-of-game';
import { writeAutoState } from './write-auto-state';

const autoSaveTick = async (): Promise<void> => {
  const game = activeGameHolder.current;
  if (!game || !hostGate(AUTO_SAVE_GATE) || chronokiCore.state().status !== 'running') return;
  const result = await writeAutoState(contextOfGame(game), 'Auto');
  appLog.info(`[auto-save] ${result.ok ? 'ok' : result.reason}`);
};

export { autoSaveTick };
