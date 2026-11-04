/* @layer shared-asset-extraction @kind constants */
import type { XlatProgram } from './xlat-program.type';

const press = (at: number): string => `0:${at},100:10,0:400`;

const S8_MASH = `0:15,${Array.from({ length: 120 }, () => '100:3,0:27').join(',')}`;

const cutScript = (script: string, frames: number): string => {
  const out: string[] = [];
  let at = 0;
  for (const tok of script.split(',')) {
    const n = Number.parseInt(tok.split(':')[1] as string, 10);
    if (at + n >= frames) {
      out.push(`${(tok.split(':')[0] as string)}:${frames - at}`);
      break;
    }
    out.push(tok);
    at += n;
  }
  return out.join(',');
};

const HDMA_RETURNS = ['C0:00CB', 'C0:00E4', 'C0:01AE', 'C0:0B15', 'C0:0B19', 'C0:0B32', 'C0:1909', 'C0:1951', 'C0:19BA'];
const FROM_C3 = { CPUTRACE_FROM: 'C30000' };

const SEQ_C3: XlatProgram = {
  states: { race: { recipe: 'attract_race_handoff' }, e3: { recipe: 'attract_entry3_handoff' } },
  traces: [
    { name: 'race', state: 'race', frames: 445, env: FROM_C3 },
    { name: 'e3', state: 'e3', frames: 330, env: FROM_C3 },
    { name: 'race_a40', state: 'race', frames: 200, env: { ...FROM_C3, CPUTRACE_BTN: press(40) } },
    { name: 'race_a170', state: 'race', frames: 300, env: { ...FROM_C3, CPUTRACE_BTN: press(170) } },
    { name: 'race_a350', state: 'race', frames: 440, env: { ...FROM_C3, CPUTRACE_BTN: press(350) } },
    { name: 'e3_a50', state: 'e3', frames: 200, env: { ...FROM_C3, CPUTRACE_BTN: press(50) } },
    { name: 'e3_a100', state: 'e3', frames: 250, env: { ...FROM_C3, CPUTRACE_BTN: press(100) } },
    { name: 'e3_a250', state: 'e3', frames: 330, env: { ...FROM_C3, CPUTRACE_BTN: press(250) } },
  ],
  images: { race: { state: 'race', script: '0:430' }, e3: { state: 'e3', script: '0:300' } },
  pairs: [['race', 'race'], ['e3', 'e3'], ['race_a40', 'race'], ['race_a170', 'race'], ['race_a350', 'race'],
    ['e3_a50', 'e3'], ['e3_a100', 'e3'], ['e3_a250', 'e3']],
  froms: ['C3:0000'],
  stops: ['C0:0000'],
};

const WIPE_C3: XlatProgram = {
  states: { '16e': { recipe: 'attract_wipe_16e' }, '01c': { recipe: 'attract_wipe_01c' } },
  traces: [{ name: '16e', state: '16e', frames: 34, env: {} }, { name: '01c', state: '01c', frames: 34, env: {} }],
  images: { '16e': { state: '16e', script: '0:0' } },
  pairs: [['16e', '16e'], ['01c', '16e']],
  froms: ['C3:000E'],
  stops: ['C0:22FE'],
};

const OWWIN_C6: XlatProgram = {
  states: { ow: { recipe: 'attract_ow_window' } },
  traces: [{ name: 'ow', state: 'ow', frames: 120, env: {} }],
  images: { ow: { state: 'ow', script: '0:0' } },
  pairs: [['ow', 'ow']],
  froms: ['C6:E241', 'C6:E27E'],
  stops: ['C2:1830'],
};

const GWARP_FD: XlatProgram = {
  states: {
    s8: { recipe: 'field_telepod_gate' },
    s8_f2300: { peekFrom: 's8', script: cutScript(S8_MASH, 2300), env: {} },
  },
  traces: [
    { name: 'w80', state: 's8', frames: 3230, env: { CPUTRACE_FROM: 'FDFFF1', CPUTRACE_BTN: S8_MASH } },
    { name: 'w81', state: 's8_f2300', frames: 420, env: { CPUTRACE_FROM: 'FDFFEB', PEEK_POKE: '7F269C=81' } },
    { name: 'w82', state: 's8_f2300', frames: 320, env: { CPUTRACE_FROM: 'FDFFE8', PEEK_POKE: '7F269C=82' } },
    { name: 'w83', state: 's8_f2300', frames: 930, env: { CPUTRACE_FROM: 'FDFFE5', PEEK_POKE: '7F269C=83' } },
  ],
  images: { s8: { state: 's8', script: S8_MASH } },
  pairs: [['w80', 's8'], ['w81', 's8'], ['w82', 's8'], ['w83', 's8']],
  froms: ['FD:FFF1', 'FD:FFEB', 'FD:FFE8', 'FD:FFE5'],
  stops: ['C0:0000'],
};

const HDMA_FD: XlatProgram = {
  states: { boot: { recipe: 'attract_boot' }, gato: { recipe: 'gato_wait' }, s8: { recipe: 'field_telepod_gate' } },
  traces: [
    { name: 'att', state: 'boot', frames: 13600, env: {} },
    { name: 'gato', state: 'gato', frames: 220, env: {} },
    { name: 's8', state: 's8', frames: 400, env: { CPUTRACE_BTN: cutScript(S8_MASH, 165) } },
  ],
  images: { boot: { state: 'boot', script: '0:0' } },
  family: [0xfdc2c1, 0xfdd52c],
  pairs: [['family', 'boot']],
  froms: ['FD:C2C1'],
  stops: HDMA_RETURNS,
};

const XLAT_PROGRAMS: Record<string, XlatProgram> = {
  seq_c3: SEQ_C3,
  wipe_c3: WIPE_C3,
  owwin_c6: OWWIN_C6,
  gwarp_fd: GWARP_FD,
  hdma_fd: HDMA_FD,
};

export { XLAT_PROGRAMS };
