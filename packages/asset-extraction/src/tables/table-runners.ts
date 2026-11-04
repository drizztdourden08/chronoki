/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { packTablesStage } from './pack-tables-stage';
import { shapesInstallStage } from './shapes-install-stage';

/** Stage id -> runner for the shapes and the table pack. */
const TABLE_RUNNERS: Record<string, StageRun> = {
  'shapes-install': shapesInstallStage,
  'pack-tables': packTablesStage,
};

export { TABLE_RUNNERS };
