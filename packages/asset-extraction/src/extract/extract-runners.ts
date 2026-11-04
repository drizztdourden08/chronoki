/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { extractAssetsStage } from './extract-assets';

/** Stage id -> runner for the extract group. */
const EXTRACT_RUNNERS: Record<string, StageRun> = {
  'extract-assets': extractAssetsStage,
};

export { EXTRACT_RUNNERS };
