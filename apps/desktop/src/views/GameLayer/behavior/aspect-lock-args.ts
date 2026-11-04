/* @layer renderer-components @kind logic */
import { TITLEBAR_HEIGHT } from '../GameLayer.constants';
import type { AspectLockArgs } from '../GameLayer.type';

const aspectLockArgs = ({ viewport, windowMode, isFullscreen, frame }: AspectLockArgs): [number, number] => {
  if (viewport !== 'fit') return [0, 0];
  const extra = windowMode === 'windowed' && !isFullscreen ? TITLEBAR_HEIGHT : 0;
  return [frame.width / frame.height, extra];
};

export { aspectLockArgs };
