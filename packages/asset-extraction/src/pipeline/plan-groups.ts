/* @layer shared-asset-extraction @kind logic */
import type { ImportStage, StageGroupId } from './stage.type';

interface StageBatch {
  group: StageGroupId;
  stages: ImportStage[];
}

/** Consecutive stages of one group become one batch; the group plan says whether the batch runs side by side. */
const planGroups = (stages: ImportStage[]): StageBatch[] => {
  const batches: StageBatch[] = [];
  for (const s of stages) {
    const last = batches[batches.length - 1];
    if (last !== undefined && last.group === s.group) last.stages.push(s);
    else batches.push({ group: s.group, stages: [s] });
  }
  return batches;
};

export { planGroups };
export type { StageBatch };
