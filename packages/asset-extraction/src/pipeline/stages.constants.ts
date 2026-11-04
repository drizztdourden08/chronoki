/* @layer shared-asset-extraction @kind constants */
import { CAPTURE_STAGES } from './stage-defs/captures.stages.constants';
import { EXTRACT_STAGES } from './stage-defs/extract.stages.constants';
import { GENERATE_STAGES } from './stage-defs/generate.stages.constants';
import { SETUP_STAGES } from './stage-defs/setup.stages.constants';
import { TAIL_STAGES } from './stage-defs/tail.stages.constants';
import type { ImportStage } from './stage.type';
import { bind } from './bind-stage';
import { checkUnique } from './check-unique-stages';

const STAGES: ImportStage[] = [
  ...SETUP_STAGES,
  ...CAPTURE_STAGES,
  ...EXTRACT_STAGES,
  ...GENERATE_STAGES,
  ...TAIL_STAGES,
].map(bind);
checkUnique(STAGES);

const STEP_TOTAL = STAGES.filter((s) => s.step).length;

export { STAGES, STEP_TOTAL };
