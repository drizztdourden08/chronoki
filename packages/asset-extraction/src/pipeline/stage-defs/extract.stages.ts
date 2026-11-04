/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import type { StageDef } from '../stage.type';

/**
 * setup.py "extracting the assets -> ct_assets.dat" (progress 10): assets/extract_assets.py build(), whose 24
 * packers become the compile-* stages in the second half of P4 (the CTAS container writer is already here).
 */
const EXTRACT_STAGES: StageDef[] = [
  stage('extract-assets', 'extract', 30, 'pending', '../assets/extract_assets.py build', 'ct_assets.dat (scenes, sprites, scripts, text)', ['compile']),
];

export { EXTRACT_STAGES };
