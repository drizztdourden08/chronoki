/* @layer renderer-components @kind logic */
import type { StageClassArgs } from '../GameLayer.type';

const stageClass = ({ visible, gates, mode }: StageClassArgs): string => {
  const classes = ['game-layer__stage'];
  if (!visible) classes.push('game-layer__stage--idle');
  if (gates.has('linearFiltering') && mode !== 'whole') classes.push('game-layer__stage--smooth');
  return classes.join(' ');
};

export { stageClass };
