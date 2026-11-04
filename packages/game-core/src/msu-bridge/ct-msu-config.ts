/* @layer bridge-wasm @kind logic */
import { defineMsuGame } from '@drizztdourden08/brock-msu';
import { MSU_TITLE_SONGS, MSU_TRACK_LABELS } from '@chronoki/game-data';
import { classifyCtMusic } from './classify-ct-music';
import {
  CT_MSU_GAME_ID, CT_MSU_PACK_ROOT, CT_MSU_RESUME_SUFFIX, CT_MSU_SOUND_CHANNELS, CT_MSU_SOUND_ID_COUNT,
} from './ct-msu-config.constants';

const ctMsuConfig = defineMsuGame({
  id: CT_MSU_GAME_ID,
  packRoot: CT_MSU_PACK_ROOT,
  soundChannels: CT_MSU_SOUND_CHANNELS,
  soundIdCount: CT_MSU_SOUND_ID_COUNT,
  trackLoops: () => true,
  classifyMusic: classifyCtMusic,
  musicLabels: MSU_TRACK_LABELS,
  isTitleScene: (scene) => MSU_TITLE_SONGS.includes(scene),
  resumePath: (profile, slotKind, slotId) => `${profile}/${slotKind}-${slotId}${CT_MSU_RESUME_SUFFIX}`,
});

export { ctMsuConfig };
