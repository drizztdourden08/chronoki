/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { ctNameMsgStage, ctNameWinStage } from './ct-name';
import { ctWindowStage } from './ct-window';
import { lzPackStage } from './lz-pack';
import { owSpritesStage } from './ow-sprites';
import { owWorldStage } from './ow-world';
import { animOpLenStage, sndTimingStage } from './simple-tools';

/** The runners of the capture stages of the second half of P4 (captures.stages.ts). */
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
