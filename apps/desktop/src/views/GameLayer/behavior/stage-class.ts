/* @layer renderer-components @kind logic */
const stageClass = (visible: boolean, gates: ReadonlySet<string>): string => {
  const classes = ['game-layer__stage'];
  if (!visible) classes.push('game-layer__stage--idle');
  if (gates.has('linearFiltering')) classes.push('game-layer__stage--smooth');
  if (gates.has('scaleStretch')) classes.push('game-layer__stage--stretch');
  return classes.join(' ');
};

export { stageClass };
