/* @layer bridge-wasm @kind logic */
import { provideGameInfo } from '@drizztdourden08/brock-game-info';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { GAME_INFO_EMPTY_TEXT } from './game-info.constants';
import type { ChronokiInfoSnapshot } from './game-info.type';
import { gameInfoGate } from './game-info-gate';
import { readChronokiInfo } from './read-chronoki-info';
import { GAME_INFO_SECTIONS } from './sections/game-info-sections';

const provideChronokiGameInfo = (): void => {
  provideGameInfo<ChronokiInfoSnapshot>({
    core: chronokiCore,
    gate: gameInfoGate,
    read: readChronokiInfo,
    sections: GAME_INFO_SECTIONS,
    emptyText: GAME_INFO_EMPTY_TEXT,
  });
};

export { provideChronokiGameInfo };
