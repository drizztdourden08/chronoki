/* @layer shared-asset-extraction @kind logic */
import { toolFileStage } from './tool-file-stage';

const animOpLenStage = toolFileStage('anim_oplen', '--animoplen', 'saves/anim_oplen.bin');

export { animOpLenStage };
