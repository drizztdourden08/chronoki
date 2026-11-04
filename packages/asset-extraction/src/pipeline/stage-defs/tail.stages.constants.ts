/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import { quietStage } from '../quiet-stage';
import type { StageDef } from '../stage.type';

const TAIL_STAGES: StageDef[] = [
  stage({ id: 'pack-tables', group: 'tail', weight: 5, status: 'ported', python: 'gen/pack_tables.py pack', label: 'ct_tables.dat (the generated tables, packed)' }),
  stage({ id: 'steam-margins', group: 'tail', weight: 1, status: 'ported', python: 'steam_wide.py', label: 'ct_wide.dat (optional, from a Steam copy)' }),
  quietStage(stage({ id: 'write-player-assets', group: 'tail', weight: 1, status: 'ported', python: 'gen/pack_tables.py into', label: 'ct_assets.dat with the tables inside' })),
];

export { TAIL_STAGES };
