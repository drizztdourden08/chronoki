/* @layer bridge-wasm @kind logic */
import type { QolPlanner } from '../qol.type';
import {
  DEATH_PEAK_FUNCTION, DEATH_PEAK_LOCATIONS, DEATH_PEAK_OBJECT, DEATH_PEAK_OLD_SONG, DEATH_PEAK_SCENE, DEATH_PEAK_SONG,
} from './alt-music.constants';
import { collectSongPlans } from './collect-song-plans';
import { planRecordSong } from './plan-record-song';
import { planSceneSong } from './plan-scene-song';

const planDeathPeakMusic: QolPlanner = (pack) =>
  collectSongPlans([
    ...DEATH_PEAK_LOCATIONS.map((loc) => planRecordSong(pack, loc, DEATH_PEAK_SONG)),
    planSceneSong(pack, {
      scene: DEATH_PEAK_SCENE, object: DEATH_PEAK_OBJECT, fn: DEATH_PEAK_FUNCTION, from: DEATH_PEAK_OLD_SONG, song: DEATH_PEAK_SONG,
    }),
  ]);

export { planDeathPeakMusic };
