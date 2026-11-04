/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { rgb, tile4 } from './ctgen/menugfx';
import { cgramOf, peek, recipeState } from './ctgen/require-tools';
import { hx } from './ctgen/text-file';

const DRIVE = '100:2,0:40';
const SINGLE: [string, number][] = [
  ['weapon', 0x20],
  ['helm', 0x27],
  ['armor', 0x28],
  ['accessory', 0x29],
];

const HEADER = [
  '// gen_opt0.h  -- opt0 (Equip/Status) DETAIL graphics extracted from the oracle.',
  '// (The portraits and element plaques are decoded from the ROM itself: menu.c mDetailArt, C2/EC38 + C2/A273.)',
  '// Format: RGBA8888 rows. Color index 0 -> (0,0,0,0) transparent. Palettes resolved from oracle CGRAM.',
  '#ifndef GEN_OPT0_H',
  '#define GEN_OPT0_H',
  '#include <stdint.h>',
  '// RGBA packed little-endian as 0xAABBGGRR',
  '',
  '// Equip-type icons (BG1 char base0, PALETTE 0), drawn at col17/x136 left of each equip name.',
];

const TILES_DOC = [
  '',
  "// The 10 equip-TYPE icon tiles 0x20-0x29 (BG1 pal0), indexed by (tile-0x20): the ROM draws an item's",
  '// icon = BYTE 0 of its $CC:0B5E name record (0x20 sword/0x21 bow/0x22 gun/0x23 arm/0x24 katana/0x25 fist/',
  '// 0x26 scythe/0x27 helm/0x28 armor/0x29 accessory). Extracted from the oracle VRAM (0x20/27/28/29 verified',
  '// byte-identical to the prior single icons).',
  'static const uint8_t gen_opt0_icon_tiles[10][8*8] = {',
];

/** tools/gen/menu_opt0.py: the Equip screen's equip-type icons (recipe menu_open_gato2, A, 40 frames on). */
const genMenuOpt0 = async (ctx: ImportContext): Promise<string> => {
  const out = await peek(ctx, await recipeState(ctx, 'menu_open_gato2'), DRIVE);
  const cg = cgramOf(out);
  const tiles = new Map<number, number[]>();
  for (let n = 0x20; n < 0x2a; n += 1) tiles.set(n, tile4(out.vram, 0, n));
  const pal = Array.from({ length: 16 }, (_, i) => {
    const [r, g, b] = rgb(cg, i);
    return i === 0 ? 0 : (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;
  });
  const lines = [...HEADER];
  for (const [name, n] of SINGLE) {
    lines.push(`static const uint8_t gen_opt0_icon_${name}[8*8] = { ${(tiles.get(n) as number[]).join(',')} };  // tile 0x${hx(n, 2)}`);
  }
  lines.push(`static const uint32_t gen_opt0_pal0[16] = { ${pal.map((c) => `0x${hx(c, 8)}`).join(', ')} };  // 0xAABBGGRR`);
  lines.push(...TILES_DOC);
  for (let n = 0x20; n < 0x2a; n += 1) lines.push(`  { ${(tiles.get(n) as number[]).join(',')} }, // 0x${hx(n, 2)}`);
  lines.push('};', '#endif', '');
  return lines.join('\n');
};

export { genMenuOpt0 };
