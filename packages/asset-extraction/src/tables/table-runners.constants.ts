/* @layer shared-asset-extraction @kind constants */
import type { StageRun } from '../pipeline/stage.type';
import { packTablesStage } from './pack-tables-stage';
import { shapesInstallStage } from './shapes-install-stage';

const TABLE_RUNNERS: Record<string, StageRun> = {
  'shapes-install': shapesInstallStage,
  'pack-tables': packTablesStage,
};

export { TABLE_RUNNERS };
