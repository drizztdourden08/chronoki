/* @layer shared-asset-extraction @kind constants */
import type { StageGroupId } from './stage.type';

interface GroupPlan {
  /** The group's stages run side by side. setup.py runs them in a row; each makes files of its own, so they can overlap. */
  parallel: boolean;
  /** A failure ends the import (setup.py sys.exit); otherwise it is reported and the rest go on. */
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
