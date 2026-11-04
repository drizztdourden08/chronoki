/* @layer shared-asset-extraction @kind types */
import type { ImportStage, StageGroupId } from './stage.type';

interface StageBatch {
  group: StageGroupId;
  stages: ImportStage[];
}

export type { StageBatch };
