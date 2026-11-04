/* @layer shared-asset-extraction @kind logic */
import type { ImportStage } from './stage.type';
import type { StageBatch } from './plan-groups.type';

const planGroups = (stages: ImportStage[]): StageBatch[] => {
  const batches: StageBatch[] = [];
  for (const s of stages) {
    const last = batches[batches.length - 1];
    if (last?.group === s.group) last.stages.push(s);
    else batches.push({ group: s.group, stages: [s] });
  }
  return batches;
};

export { planGroups };
