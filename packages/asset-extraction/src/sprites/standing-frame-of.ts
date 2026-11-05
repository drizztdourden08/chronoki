/* @layer shared-asset-extraction @kind logic */
import { STANDING_FRAME_BYTE } from './party-sprites.constants';

const standingFrameOf = (spriteAnim: Uint8Array): number => {
  const frame = spriteAnim[STANDING_FRAME_BYTE];
  if (frame === undefined) throw new Error('SPRITEANIM blob too short for a standing frame');
  return frame;
};

export { standingFrameOf };
