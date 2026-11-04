/* @layer shared-asset-extraction @kind logic */
import type { StageDef, StageGroupId, StageNeed, StageStatus } from './stage.type';

const stage = (
  id: string,
  group: StageGroupId,
  weight: number,
  status: StageStatus,
  python: string,
  label: string,
  needs: StageNeed[] = [],
): StageDef => ({ id, label, python, group, weight, status, step: true, needs });

const quietStage = (def: StageDef): StageDef => ({ ...def, step: false });

export { quietStage, stage };
