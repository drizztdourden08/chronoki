/* @layer shared-asset-extraction @kind constants */
import { quietStage, stage } from '../stage-def';
import type { StageDef } from '../stage.type';

/** The pack (progress 60), the optional Steam margins (61) and the player's files written at the end. */
const TAIL_STAGES: StageDef[] = [
  stage('pack-tables', 'tail', 5, 'pending', 'gen/pack_tables.py pack', 'ct_tables.dat (the generated tables, packed)'),
  stage('steam-margins', 'tail', 1, 'pending', 'steam_wide.py', 'ct_wide.dat (optional, from a Steam copy)'),
  quietStage(stage('write-player-assets', 'tail', 1, 'ported', 'gen/pack_tables.py into', 'ct_assets.dat with the tables inside')),
];

export { TAIL_STAGES };
