/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { wramOfState } from './ctgen/wram-of-state';
import { recipeState } from './ctgen/recipe-state';
import { hx } from './ctgen/hx';
import { itemFx, N } from './menu-itemuse-fx';

const join = (v: number[]): string => v.join(', ');
const hexList = (v: Uint8Array): string => Array.from(v, (b) => `0x${hx(b, 2)}`).join(', ');

const HEADER = [
  '// GENERATED (menu_itemuse gen) -- item-menu Use/Organize data, ROM-free bake.',
  '// ctItemProp = oracle $7E7700 static item-property table (bit1=field-usable, bit3=key-item).',
  '// ctItemFx*  = ROM effect table $CC:05CC + scope $CC:1BB5 decoded (Tonic oracle-validated).',
  '#ifndef CT_MENU_ITEMUSE_H',
  '#define CT_MENU_ITEMUSE_H',
  '#include <stdint.h>',
  '',
  '// $7700[id] for id 0x00..0xF2 (static per-item props). bit1(0x02)=usable, bit3(0x08)=key.',
  'static const uint8_t ctItemProp[0xF3] = {',
];

/** tools/gen/menu_itemuse.py: the Item screen's Use / Organize data (ROM and the menu_open_gato2 state's $7E:7700). */
const genMenuItemuse = async (ctx: ImportContext): Promise<string> => {
  const rom = ctx.rom;
  const prop = wramOfState(await recipeState(ctx, 'menu_open_gato2')).slice(0x7700, 0x7700 + 0xf3);
  // C2/9969 `LDA $0D34 / BEQ / LDA #02 / TRB $77C8`: the menu was opened off a save point, so the Shelter's field-usable
  // bit is gone from the capture. Put it back from C2/98B5's own source ($CC:0000 + X & 1E, C2/88AD).
  const x = ((rom[0x3fcf16] as number) | ((rom[0x3fcf17] as number) << 8)) + (0xc8 - 0xbc) * (rom[0x3fcf1c] as number);
  prop[0xc8] = (prop[0xc8] as number) | ((rom[0x0c0000 + x] as number) & 0x02);
  const { kind, amt, allp, pool } = itemFx(rom, prop);
  const lines = [...HEADER];
  for (let i = 0; i < 0xf3; i += 16) lines.push(`  ${Array.from(prop.subarray(i, i + 16), (b) => `0x${hx(b, 2)},`).join('')}`);
  lines.push(
    '};',
    '',
    '// Effect kinds',
    '#define ITFX_NONE 0',
    '#define ITFX_HP   1',
    '#define ITFX_MP   2',
    '#define ITFX_FULL 3  /* restore HP and/or MP to max (pools in ctItemFxPool) */',
    '#define ITFX_TAB  4  /* permanent +1 stat (amount = 0 pow,1 mag,2 spd) */',
    '',
    '// Per-consumable effect for ids 0xBC..0xCF (index = id-0xBC).',
    '#define ITFX_BASE 0xBC',
    '#define ITFX_N    20',
    `static const uint8_t  ctItemFxKind[ITFX_N] = { ${join(kind)} };`,
    `static const uint16_t ctItemFxAmt [ITFX_N] = { ${join(amt)} };`,
    `static const uint8_t  ctItemFxAll [ITFX_N] = { ${join(allp)} };`,
    `static const uint8_t  ctItemFxPool[ITFX_N] = { ${join(pool)} }; // bit0=HP bit1=MP (for FULL); idx13=C9 PowerMeal=HP+MP (dispatch B107)`,
    '',
    '// Organize group ranges (ROM C2/AC12 start ids, C2/AC17 lengths).',
    `static const uint8_t ctOrgStart[5] = { ${hexList(rom.subarray(0x2ac12, 0x2ac17))} };`,
    `static const uint8_t ctOrgLen  [5] = { ${hexList(rom.subarray(0x2ac17, 0x2ac1c))} };`,
    '',
    '#endif',
    '',
  );
  if (kind.length !== N) throw new Error('menu_itemuse: the effect table is not 20 long');
  return lines.join('\n');
};

export { genMenuItemuse };
