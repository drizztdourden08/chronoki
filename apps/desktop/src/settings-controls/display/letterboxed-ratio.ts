/* @layer renderer-app @kind logic */
import { aspectRatioValue } from '@drizztdourden08/brock-display/aspect-ratio';
import { letterboxBox } from '@chronoki/game-core';
import type { AppSettings } from '@app/settings.type';
import { ASPECT_LIMITS, ENGINE_LINES } from './display.constants';

const isLetterboxed = ({ aspectRatio, customAspectW, customAspectH }: AppSettings): boolean => {
  if (aspectRatio === 'original') return false;
  const ratio = aspectRatioValue(aspectRatio, { customW: customAspectW, customH: customAspectH, limits: ASPECT_LIMITS, letterbox: true });
  return letterboxBox(ratio).height > ENGINE_LINES;
};

export { isLetterboxed };
