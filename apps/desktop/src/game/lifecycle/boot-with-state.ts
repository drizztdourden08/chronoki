/* @layer bridge-wasm @kind logic */
import { pushState } from '../save-states/push-state';
import { provideChronokiGameInfo } from '../game-info';
import { activeGameHolder } from './active-game-holder';
import type { ActiveGame } from './active-game.type';
import { bootGameModule } from './boot-game-module';
import { chronokiCore } from './chronoki-core';
import type { RunningPlan } from './replan-game.type';
import { startSessionServices } from './start-session-services';

type Booted = { game: ActiveGame; loaded: boolean } | null;

const bootWithState = async (base: ActiveGame, plan: RunningPlan, state: Uint8Array): Promise<Booted> => {
  const { canvas, files, romFile, profileId, store } = base;
  const session = await bootGameModule({ canvas, files, romFile, profileId, config: plan.config, settings: plan.settings, volume: 0 }, store);
  if (!session) return null;
  const game: ActiveGame = { ...base, session, unsubscribePause: startSessionServices({ store, profileId }) };
  activeGameHolder.current = game;
  provideChronokiGameInfo();
  const pushed = await pushState(chronokiCore, state);
  return { game, loaded: pushed.ok };
};

export { bootWithState };
