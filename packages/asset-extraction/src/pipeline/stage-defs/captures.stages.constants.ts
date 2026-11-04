/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import type { StageDef } from '../stage.type';

const CAPTURE_STAGES: StageDef[] = [
  stage({ id: 'snd_timing', group: 'captures', weight: 6, status: 'ported', python: 'gen/snd_timing.py', label: 'snd_timing.bin', needs: ['oracle'] }),
  stage({ id: 'anim_oplen', group: 'captures', weight: 1, status: 'ported', python: 'gen/anim_oplen.py', label: 'anim_oplen.bin', needs: ['oracle'] }),
  stage({ id: 'lz_pack', group: 'captures', weight: 1, status: 'ported', python: 'gen/lz_pack.py', label: 'lz_pack.bin', needs: ['oracle'] }),
  stage({ id: 'ow_world', group: 'captures', weight: 6, status: 'ported', python: 'gen/ow_world.py', label: 'ow_w0..7 live wram/vram', needs: ['oracle'] }),
  stage({ id: 'ow_sprites', group: 'captures', weight: 6, status: 'ported', python: 'gen/ow_sprites.py', label: 'ow_crono, ow_gulls, ow_boat, ow_balloons', needs: ['oracle'] }),
  stage({ id: 'ct_window', group: 'captures', weight: 6, status: 'ported', python: 'gen/ct_window.py', label: 'ct_window.bin', needs: ['oracle'] }),
  stage({ id: 'ct_namewin', group: 'captures', weight: 6, status: 'ported', python: 'gen/ct_namewin.py', label: 'ct_namewin.bin', needs: ['oracle'] }),
  stage({ id: 'ct_namemsg', group: 'captures', weight: 6, status: 'ported', python: 'gen/ct_namemsg.py', label: 'ct_namemsg.bin', needs: ['oracle'] }),
];

export { CAPTURE_STAGES };
