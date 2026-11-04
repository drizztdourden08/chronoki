/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { block16, rgb } from './ctgen/menugfx';
import { cgramOf, peek, recipeState } from './ctgen/require-tools';
import { hx } from './ctgen/text-file';
import { DRIVE, OBJ, TAIL, REMOVED } from './menu-itemdetail.constants';

const genMenuItemdetail = async (ctx: ImportContext): Promise<string> => {
  const out = await peek(ctx, await recipeState(ctx, 'menu_open_gato2'), DRIVE);
  const cg = cgramOf(out);
  const s = out.oam.subarray(28 * 4, 28 * 4 + 4);
  const hi = (out.oam[512 + 7] as number) & 3;
  const got = [s[0], s[1], s[2], (s[3] as number) & 0x0f, hi];
  if (got.join() !== [24, 87, 0x20, 0, 2].join()) {
    throw new Error(
      `menu_itemdetail: OBJ 28 is not the hand (x=24 y=87 tile 20, 16x16): ${Array.from(s, (b) => hx(b, 2).toLowerCase()).join('')} ${hi}`,
    );
  }
  const t = (s[2] as number) | (((s[3] as number) & 1) << 8);
  const pal = ((s[3] as number) >> 1) & 7;
  const idx = block16(out.vram, OBJ, t, t + 1, t + 16, t + 17);
  const cols = Array.from({ length: 16 }, (_, i) => rgb(cg, 128 + pal * 16 + i));
  const used = [...new Set(idx)].sort((a, b) => a - b);
  const rowsOf = (y: number): number[] => idx.slice(y * 16, y * 16 + 16);
  const rgbaRows = Array.from({ length: 16 }, (_, y) =>
    `  ${rowsOf(y).map((i) => (i === 0 ? '0,0,0,0' : `${(cols[i] as number[]).join(',')},255`)).join(',')}`,
  );
  const idxRows = Array.from({ length: 16 }, (_, y) => `  ${rowsOf(y).join(',')}`);
  const lines = [
    '// gen_itemdetail.h - CT item-menu SELECTION CURSOR (hand), extracted from the oracle.',
    '// Source: saves/menu_open_gato2.state + btnscript "80:2,0:6,100:2,0:12" (opt1 ITEM, A).',
    `// OBJ sprite 28: OAM x=${s[0]} y=${s[1]} tile=0x${hx(t, 3)} pal=${pal} prio=${((s[3] as number) >> 4) & 3} size=1 (16x16). VRAM OBJ char base`,
    '// byte 0x8000 (objTileAdr1=0x4000 word); 16x16 = tiles 0x20,0x21,0x30,0x31. Palette = OBJ',
    "// pal0 = CGRAM entries 128..143 (BGR555 in the state's .oam bytes 1056+). idx0 = transparent.",
    '// This is the MENU CURSOR (points at the highlighted item), NOT a per-item type marker.',
    '// Format: RGBA8888, 16x16, row-major. Alpha 0 where palette index == 0 (transparent).',
    '#ifndef GEN_ITEMDETAIL_H',
    '#define GEN_ITEMDETAIL_H',
    '#define ITEMCURSOR_W 16',
    '#define ITEMCURSOR_H 16',
    `// OBJ pal0 colors used (RGB): ${used.map((i) => `${i}=(${(cols[i] as number[]).join(',')})`).join(', ')}`,
    "// (colour 14 = BGR555 (13,12,12) through the framebuffer's (v<<3)|(v>>2); it was baked as 106,98,98 = v*255/31,",
    "//  one off on every channel -- measured 2026-09-24 on the oracle's own Item and Shop frames: 107,99,99.)",
    'static const unsigned char itemCursorRGBA[16*16*4] = {',
    rgbaRows.join(',\n'),
    '};',
    'static const unsigned char itemCursorIdx[16*16] = {',
    idxRows.join(',\n'),
    '};',
    ...TAIL,
    `  ${cols.map((c) => c.join(',')).join(',')}`,
    '};',
    ...REMOVED,
  ];
  return lines.join('\n');
};

export { genMenuItemdetail };
