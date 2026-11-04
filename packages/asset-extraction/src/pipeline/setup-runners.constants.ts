/* @layer shared-asset-extraction @kind constants */
import type { StageRun } from './stage.type';

import { verifyRomStage } from './verify-rom-stage';
import { oracleStage } from './oracle-stage';
import { replayRecipesStage } from './replay-recipes-stage';
import { writePlayerAssetsStage } from './write-player-assets-stage';

const SETUP_RUNNERS: Record<string, StageRun> = {
  'verify-rom': verifyRomStage,
  oracle: oracleStage,
  'replay-recipes': replayRecipesStage,
  'write-player-assets': writePlayerAssetsStage,
};

export { SETUP_RUNNERS };
