/* @layer renderer-components @kind logic */
import { TITLEBAR_HEIGHT } from '../GameLayer.constants';
import type { AspectLockArgs } from '../GameLayer.type';

const aspectLockArgs = ({ viewport, windowMode, isFullscreen, ratio }: AspectLockArgs): [number, number] => {
  if (viewport !== 'fit' || !(ratio > 0)) return [0, 0];
  const extra = windowMode === 'windowed' && !isFullscreen ? TITLEBAR_HEIGHT : 0;
  return [ratio, extra];
};

export { aspectLockArgs };
