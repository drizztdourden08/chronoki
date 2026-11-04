/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import { quietStage } from '../quiet-stage';
import type { StageDef } from '../stage.type';

const SETUP_STAGES: StageDef[] = [
  quietStage(stage('verify-rom', 'setup', 1, 'ported', 'setup.py main; ctlib/rom.py load, verify', 'ROM verified (Chrono Trigger USA, SHA-1)')),
  quietStage(stage('shapes-install', 'setup', 1, 'ported', 'gen/shapes.py install', 'zeroed shapes for the bootstrap build')),
  stage('oracle', 'setup', 5, 'ported', 'setup.py main (--oracle / build ct.exe)', 'boot the oracle', ['oracle']),
  quietStage(stage('replay-recipes', 'setup', 400, 'ported', 'recipes.py make_many', 'replay the recipes the generators need', ['oracle'])),
];

export { SETUP_STAGES };
