/* @layer shared-asset-extraction @kind types */
import type { StageGroupId, StageNeed, StageStatus } from './stage.type';

interface StageArgs {
  id: string;
  group: StageGroupId;
  weight: number;
  status: StageStatus;
  python: string;
  label: string;
  needs?: StageNeed[];
  after?: string[];
}

export type { StageArgs };
