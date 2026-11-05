/* @layer bridge-wasm @kind logic */
import { defineMsuStudio } from '@drizztdourden08/brock-msu/renderer';
import { ctMsuConfig } from '@chronoki/game-core';
import { MSU_TRACK_COUNT } from '@chronoki/game-data';
import { ctTrackName } from './ct-track-name';
import { NO_SOUNDS } from './no-sounds.constants';
import type { ChronokiMsuStudioGame } from './msu-studio.type';

const chronokiMsuStudio: ChronokiMsuStudioGame = defineMsuStudio<never, never>({
  config: ctMsuConfig,
  trackName: ctTrackName,
  baseTrackCount: MSU_TRACK_COUNT,
  sounds: NO_SOUNDS,
  previewContext: undefined as never,
});

export { chronokiMsuStudio };
