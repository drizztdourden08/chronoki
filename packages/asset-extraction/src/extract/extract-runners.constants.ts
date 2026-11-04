/* @layer shared-asset-extraction @kind constants */
import type { StageRun } from '../pipeline/stage.type';
import { extractAssetsStage } from './extract-assets';

const EXTRACT_RUNNERS: Record<string, StageRun> = {
  'extract-assets': extractAssetsStage,
};

export { EXTRACT_RUNNERS };
