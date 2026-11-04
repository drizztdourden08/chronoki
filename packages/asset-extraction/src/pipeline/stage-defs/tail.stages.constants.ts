/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import { quietStage } from '../quiet-stage';
import type { StageDef } from '../stage.type';

const TAIL_STAGES: StageDef[] = [
  stage('pack-tables', 'tail', 5, 'ported', 'gen/pack_tables.py pack', 'ct_tables.dat (the generated tables, packed)'),
  stage('steam-margins', 'tail', 1, 'ported', 'steam_wide.py', 'ct_wide.dat (optional, from a Steam copy)'),
  quietStage(stage('write-player-assets', 'tail', 1, 'ported', 'gen/pack_tables.py into', 'ct_assets.dat with the tables inside')),
];

export { TAIL_STAGES };
