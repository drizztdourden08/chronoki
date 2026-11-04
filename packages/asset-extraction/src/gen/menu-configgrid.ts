/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { block16, rgba, tile4 } from './ctgen/menugfx';
import { cgramOf, peek, recipeState } from './ctgen/require-tools';
import { hx } from './ctgen/text-file';
import { DRIVE, ICONS, HEADER } from './menu-configgrid.constants';

const icon = (vram: Uint8Array, cg: Uint8Array, [name, base, pal, big]: [string, number, number, number]): string[] => {
  let idx: number[];
  let rows: number;
  const lines: string[] = [];
  if (big) {
    idx = block16(vram, 0, base, base + 1, base + 2, base + 3);
    rows = 16;
    lines.push(`// tile 0x${hx(base, 3)}-0x${hx(base + 3, 3)}, palette ${pal}`, `static const uint8_t ${name}[16*16*4] = {`);
  } else {
    const t0 = tile4(vram, 0, base);
    const t1 = tile4(vram, 0, base + 1);
    idx = [];
    for (let y = 0; y < 8; y += 1) for (let x = 0; x < 16; x += 1) idx.push(((x < 8 ? t0 : t1)[y * 8 + (x % 8)]) as number);
    rows = 8;
    lines.push(`// tile 0x${hx(base, 3)}-0x${hx(base + 1, 3)}, palette ${pal} (16x8)`, `static const uint8_t ${name}[8*16*4] = {`);
  }
  for (let y = 0; y < rows; y += 1) {
    lines.push(`  ${idx.slice(y * 16, y * 16 + 16).map((i) => `${rgba(cg, pal * 16 + i).join(',')},`).join('')}`);
  }
  lines.push('};', '');
  return lines;
};

const genMenuConfiggrid = async (ctx: ImportContext): Promise<string> => {
  const out = await peek(ctx, await recipeState(ctx, 'menu_open_gato2'), DRIVE);
  const cg = cgramOf(out);
  const lines = [...HEADER, ...ICONS.flatMap((i) => icon(out.vram, cg, i)), '#endif // GEN_CONFIGGRID_H'];
  return `${lines.join('\n')}\n`;
};

export { genMenuConfiggrid };
