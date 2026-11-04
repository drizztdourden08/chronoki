/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { recipeState, requireTools } from './ctgen/require-tools';
import { hx } from './ctgen/text-file';

const REGS = '7E0100:2,7E0020:2,7E0026:2,7E00E3:1,7E00E7:1';
const ROW = new RegExp(
  '^\\s*f(\\d+)\\s+7E0100=([0-9A-F]{4})\\*?\\s+7E0020=([0-9A-F]{4})\\*?\\s+7E0026=([0-9A-F]{4})\\*?' +
    '\\s+7E00E3=([0-9A-F]{2})\\*?\\s+7E00E7=([0-9A-F]{2})',
);

/** The monitor prints a word's bytes low first: "1F01" is $011F. */
const word = (s: string): number => Number.parseInt(s.slice(2, 4) + s.slice(0, 2), 16);

type Row = [number, number, number, number, number];

const header = (x: number, y: number, e3: number, e7: number, n: number): string =>
  [
    '// The new-game 1000 A.D. overworld intro (loc 496): the STARTING camera of start_scene.state -- the same capture',
    '// instant as the intro object snapshot the world blob carries (introSnap) -- and the pan\'s length.',
    `//   $20 = ${hx(x, 4)}, $26 = ${hx(y, 4)} (BG1/BG2 scroll), cells $E3 = ${hx(e3, 2)}, $E7 = ${hx(e7, 2)}       (--monitor at f0)`,
    `//   the cutscene's own script requests loc $10F at frame ${n}              (C2:1150 \`$0100 = 010F\`, C2:1163 \`$027C = 02\`)`,
    '// The per-frame trajectory that used to be recorded here is gone: the cutscene\'s object scripts (C2/066C, C2/0568 --',
    "// world.c obScroll) move the camera, and the port's $20/$26 equal the cartridge's on every frame of the pan.",
    '#ifndef CT_NG_PAN_H',
    '#define CT_NG_PAN_H',
    `#define NG_PAN_FRAMES ${n}`,
    `#define NG_PAN_START_X ${x}`,
    `#define NG_PAN_START_Y ${y}`,
    '#endif',
    '',
  ].join('\n');

/** tools/gen/ct_ng_pan.py: the new-game 1000 A.D. overworld pan's starting camera and length (recipe ow_intro_pan). */
const genCtNgPan = async (ctx: ImportContext): Promise<string> => {
  const state = await recipeState(ctx, 'ow_intro_pan');
  const stdout = await requireTools(ctx).monitor(state, REGS, 2000);
  const rows = new Map<number, Row>();
  for (const line of stdout.split(/\r?\n/)) {
    const m = ROW.exec(line);
    if (m) {
      rows.set(Number(m[1]), [
        word(m[2] as string),
        word(m[3] as string),
        word(m[4] as string),
        Number.parseInt(m[5] as string, 16),
        Number.parseInt(m[6] as string, 16),
      ]);
    }
  }
  const first = rows.get(0);
  if (first === undefined) throw new Error(`ct_ng_pan: ct.exe --monitor printed no rows: ${stdout.slice(-600)}`);
  const [loc0, x, y, e3, e7] = first;
  if (loc0 !== 0x1f0) throw new Error(`ct_ng_pan: the state is not on the 1000 A.D. overworld (loc ${hx(loc0, 3)})`);
  const requested = [...rows.keys()].sort((a, b) => a - b).filter((f) => (rows.get(f) as Row)[0] === 0x10f);
  if (requested.length === 0) throw new Error('ct_ng_pan: the pan never requested loc $10F within 2000 frames');
  return header(x, y, e3, e7, requested[0] as number);
};

export { genCtNgPan };
