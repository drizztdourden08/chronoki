/* @layer shared-asset-extraction @kind logic */
import { toolFileStage } from './tool-file-stage';

const sndTimingStage = toolFileStage('snd_timing', '--sndtiming', 'saves/snd_timing.bin');

export { sndTimingStage };
