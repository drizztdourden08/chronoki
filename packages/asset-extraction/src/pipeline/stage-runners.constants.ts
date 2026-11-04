/* @layer shared-asset-extraction @kind constants */
import { EXTRACT_RUNNERS } from '../extract/extract-runners.constants';
import { GEN_RUNNERS } from '../gen/gen-runners.constants';
import { TABLE_RUNNERS } from '../tables/table-runners.constants';
import { SETUP_RUNNERS } from './setup-runners.constants';
import type { StageRun } from './stage.type';

const RUNNERS: Record<string, StageRun> = {
  ...SETUP_RUNNERS,
  ...EXTRACT_RUNNERS,
  ...GEN_RUNNERS,
  ...TABLE_RUNNERS,
};

export { RUNNERS };
