/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import type { StageDef } from '../stage.type';

/** The generators marked "stage": "assets": the captures ct_assets.dat packs (progress 2 to 9). */
const CAPTURE_STAGES: StageDef[] = [
  stage('snd_timing', 'captures', 6, 'ported', 'gen/snd_timing.py', 'snd_timing.bin', ['oracle']),
  stage('anim_oplen', 'captures', 1, 'ported', 'gen/anim_oplen.py', 'anim_oplen.bin', ['oracle']),
  stage('lz_pack', 'captures', 1, 'ported', 'gen/lz_pack.py', 'lz_pack.bin', ['oracle']),
  stage('ow_world', 'captures', 6, 'ported', 'gen/ow_world.py', 'ow_w0..7 live wram/vram', ['oracle']),
  stage('ow_sprites', 'captures', 6, 'ported', 'gen/ow_sprites.py', 'ow_crono, ow_gulls, ow_boat, ow_balloons', ['oracle']),
  stage('ct_window', 'captures', 6, 'ported', 'gen/ct_window.py', 'ct_window.bin', ['oracle']),
  stage('ct_namewin', 'captures', 6, 'ported', 'gen/ct_namewin.py', 'ct_namewin.bin', ['oracle']),
  stage('ct_namemsg', 'captures', 6, 'ported', 'gen/ct_namemsg.py', 'ct_namemsg.bin', ['oracle']),
];

export { CAPTURE_STAGES };
