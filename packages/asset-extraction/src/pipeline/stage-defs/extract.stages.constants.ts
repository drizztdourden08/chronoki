/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import type { StageDef } from '../stage.type';

const EXTRACT_STAGES: StageDef[] = [
  stage('extract-assets', 'extract', 30, 'ported', '../assets/extract_assets.py build', 'ct_assets.dat (scenes, sprites, scripts, text)', ['compile']),
];

export { EXTRACT_STAGES };
