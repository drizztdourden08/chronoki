/* @layer renderer-components @kind logic */
import type { StageClassArgs } from '../GameLayer.type';

const stageClass = ({ visible, gates, viewport, pixelPerfect, boxed }: StageClassArgs): string => {
  const classes = ['game-layer__stage'];
  if (!visible) classes.push('game-layer__stage--idle');
  if (gates.has('linearFiltering') && !pixelPerfect) classes.push('game-layer__stage--smooth');
  if (viewport === 'fill') classes.push('game-layer__stage--stretch');
  if (viewport === 'fit') classes.push('game-layer__stage--fit');
  if (pixelPerfect) classes.push('game-layer__stage--pixel-perfect');
  if (boxed) classes.push('game-layer__stage--boxed');
  return classes.join(' ');
};

export { stageClass };
