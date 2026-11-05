/* @layer bridge-wasm @kind logic */
import type { QolPlanner } from '../qol.type';
import { ZENAN_FUNCTION, ZENAN_OBJECT, ZENAN_SCENE, ZENAN_SONG } from './alt-music.constants';
import { collectSongPlans } from './collect-song-plans';
import { planSceneSong } from './plan-scene-song';

const planZenanMusic: QolPlanner = (pack) =>
  collectSongPlans([
    planSceneSong(pack, { scene: ZENAN_SCENE, object: ZENAN_OBJECT, fn: ZENAN_FUNCTION, from: null, song: ZENAN_SONG }),
  ]);

export { planZenanMusic };
