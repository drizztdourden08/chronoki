/* @layer shared-asset-extraction @kind logic */
import { EXTRACT_RUNNERS } from '../extract/extract-runners';
import { GEN_RUNNERS } from '../gen/gen-runners.constants';
import { TABLE_RUNNERS } from '../tables/table-runners';
import { SETUP_RUNNERS } from './setup-runners';
import { CAPTURE_STAGES } from './stage-defs/captures.stages';
import { EXTRACT_STAGES } from './stage-defs/extract.stages';
import { GENERATE_STAGES } from './stage-defs/generate.stages';
import { SETUP_STAGES } from './stage-defs/setup.stages';
import { TAIL_STAGES } from './stage-defs/tail.stages';
import type { ImportStage, StageDef, StageRun } from './stage.type';

const RUNNERS: Record<string, StageRun> = {
  ...SETUP_RUNNERS,
  ...EXTRACT_RUNNERS,
  ...GEN_RUNNERS,
  ...TABLE_RUNNERS,
};

const bind = (def: StageDef): ImportStage => {
  const run = RUNNERS[def.id] ?? null;
  if (def.status === 'ported' && run === null) throw new Error(`stage ${def.id} is ported but has no runner`);
  if (def.status === 'pending' && run !== null) throw new Error(`stage ${def.id} has a runner but is pending`);
  return { ...def, run };
};

const checkUnique = (stages: ImportStage[]): void => {
  const seen = new Set<string>();
  for (const s of stages) {
    if (seen.has(s.id)) throw new Error(`stage id ${s.id} is defined twice`);
    seen.add(s.id);
  }
};

/** Every stage of setup.py, in its order: the registry the runner walks. */
const STAGES: ImportStage[] = [
  ...SETUP_STAGES,
  ...CAPTURE_STAGES,
  ...EXTRACT_STAGES,
  ...GENERATE_STAGES,
  ...TAIL_STAGES,
].map(bind);
checkUnique(STAGES);

/** setup.py's "progress K/N" total. */
const STEP_TOTAL = STAGES.filter((s) => s.step).length;

export { STAGES, STEP_TOTAL };
