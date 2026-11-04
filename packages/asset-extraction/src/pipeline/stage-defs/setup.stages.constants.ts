/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import { quietStage } from '../quiet-stage';
import type { StageDef } from '../stage.type';

const SETUP_STAGES: StageDef[] = [
  quietStage(stage({ id: 'verify-rom', group: 'setup', weight: 1, status: 'ported', python: 'setup.py main; ctlib/rom.py load, verify', label: 'ROM verified (Chrono Trigger USA, SHA-1)' })),
  quietStage(stage({ id: 'shapes-install', group: 'setup', weight: 1, status: 'ported', python: 'gen/shapes.py install', label: 'zeroed shapes for the bootstrap build' })),
  stage({ id: 'oracle', group: 'setup', weight: 5, status: 'ported', python: 'setup.py main (--oracle / build ct.exe)', label: 'boot the oracle', needs: ['oracle'] }),
  quietStage(stage({ id: 'replay-recipes', group: 'setup', weight: 400, status: 'ported', python: 'recipes.py make_many', label: 'replay the recipes the generators need', needs: ['oracle'] })),
];

export { SETUP_STAGES };
