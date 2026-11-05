/* @layer bridge-wasm @kind logic */
import { defineMsuStudio } from '@drizztdourden08/brock-msu/renderer';
import { ctMsuConfig } from '@chronoki/game-core';
import { MSU_TRACK_COUNT } from '@chronoki/game-data';
import { ctTrackName } from './ct-track-name';
import { NO_SOUNDS } from './no-sounds.constants';

const chronokiMsuStudio = defineMsuStudio({
  config: ctMsuConfig,
  trackName: ctTrackName,
  baseTrackCount: MSU_TRACK_COUNT,
  sounds: NO_SOUNDS,
  previewContext: undefined,
});

export { chronokiMsuStudio };
