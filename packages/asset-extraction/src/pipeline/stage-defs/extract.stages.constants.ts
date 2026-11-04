/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import type { StageDef } from '../stage.type';

const EXTRACT_STAGES: StageDef[] = [
  stage({ id: 'extract-assets', group: 'extract', weight: 30, status: 'ported', python: '../assets/extract_assets.py build', label: 'ct_assets.dat (scenes, sprites, scripts, text)', needs: ['compile'] }),
];

export { EXTRACT_STAGES };
