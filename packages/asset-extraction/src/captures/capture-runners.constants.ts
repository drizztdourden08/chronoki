/* @layer shared-asset-extraction @kind constants */
import type { StageRun } from '../pipeline/stage.type';
import { ctNameMsgStage } from './ct-name';
import { ctNameWinStage } from './ct-name-win-stage';
import { ctWindowStage } from './ct-window';
import { lzPackStage } from './lz-pack-stage';
import { owSpritesStage } from './ow-sprites';
import { owWorldStage } from './ow-world';
import { animOpLenStage } from './simple-tools';
import { sndTimingStage } from './snd-timing-stage';

const CAPTURE_RUNNERS: Record<string, StageRun> = {
  snd_timing: sndTimingStage,
  anim_oplen: animOpLenStage,
  lz_pack: lzPackStage,
  ow_world: owWorldStage,
  ow_sprites: owSpritesStage,
  ct_window: ctWindowStage,
  ct_namewin: ctNameWinStage,
  ct_namemsg: ctNameMsgStage,
};

export { CAPTURE_RUNNERS };
