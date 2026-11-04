/* @layer shared-asset-extraction @kind constants */
import type { StageGroupId } from './stage.type';

interface GroupPlan {
  parallel: boolean;
  fatal: boolean;
}

const GROUP_PLAN: Record<StageGroupId, GroupPlan> = {
  setup: { parallel: false, fatal: true },
  captures: { parallel: true, fatal: false },
  extract: { parallel: false, fatal: true },
  generate: { parallel: true, fatal: false },
  tail: { parallel: false, fatal: false },
};

export { GROUP_PLAN };
export type { GroupPlan };
