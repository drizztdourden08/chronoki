/* @layer shared-asset-extraction @kind logic */
import type { ImportStage, StageDef } from './stage.type';
import { RUNNERS } from './stage-runners.constants';

const bind = (def: StageDef): ImportStage => {
  const run = RUNNERS[def.id] ?? null;
  if (def.status === 'ported' && run === null) throw new Error(`stage ${def.id} is ported but has no runner`);
  if (def.status === 'pending' && run !== null) throw new Error(`stage ${def.id} has a runner but is pending`);
  return { ...def, run };
};

export { bind };
