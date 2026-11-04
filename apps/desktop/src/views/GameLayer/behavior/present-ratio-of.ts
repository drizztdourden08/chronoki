/* @layer renderer-components @kind logic */
import { aspectRatioValue } from '@drizztdourden08/brock-display/aspect-ratio';
import { aspectAfterTall } from '@chronoki/features';
import { ASPECT_LIMITS } from '@app/settings-controls/display/display.constants';
import type { PresentRatioArgs } from '../GameLayer.type';

const presentRatioOf = ({ gates, aspectRatio, customAspectW, customAspectH }: PresentRatioArgs): number => {
  if (!gates.has('widescreen')) return 0;
  const choice = aspectAfterTall(aspectRatio, gates.has('tallRendering'));
  if (choice === 'original') return 0;
  return aspectRatioValue(choice, { customW: customAspectW, customH: customAspectH, limits: ASPECT_LIMITS, letterbox: true });
};

export { presentRatioOf };
