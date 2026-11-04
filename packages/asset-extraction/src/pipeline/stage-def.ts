/* @layer shared-asset-extraction @kind logic */
import type { StageDef, StageGroupId, StageNeed, StageStatus } from './stage.type';

/** A stage setup.py counts in "progress K/N": its label is the file(s) it makes. */
const stage = (
  id: string,
  group: StageGroupId,
  weight: number,
  status: StageStatus,
  python: string,
  label: string,
  needs: StageNeed[] = [],
): StageDef => ({ id, label, python, group, weight, status, step: true, needs });

/** A stage of setup.py that is not one of its numbered progress steps. */
const quietStage = (def: StageDef): StageDef => ({ ...def, step: false });

export { quietStage, stage };
