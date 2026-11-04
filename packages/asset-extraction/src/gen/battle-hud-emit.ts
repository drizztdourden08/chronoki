/* @layer shared-asset-extraction @kind logic */
import { hexN } from './shared/py-format';
import type { MapCell } from './battle-hud-bake.type';
import { HUD_HEAD } from './battle-hud-head-text.constants';
import type { Rgb3 } from './battle-hud-strip.type';
import { STRIP_H } from './battle-hud-strip.constants';
import type { HudBake } from './battle-hud-emit.type';

const trip = (c: Rgb3): string => `{${c[0]},${c[1]},${c[2]}}`;

const carrPal = (name: string, pal: Rgb3[][]): string =>
  [
    `static const uint8_t ${name}[8][4][3] = {\n`,
    ...pal.map((row) => `  {${row.map(trip).join(', ')}},\n`),
    '};\n',
  ].join('');

const carrMap = (name: string, m: MapCell[][]): string =>
  [
    `static const uint16_t ${name}[7][32] = {   /* (tile<<0)|(pal<<10) per cell */\n`,
    ...m.map((row) => `  {${row.map(([t, p]) => `0x${hexN(t | (p << 10), 4)}`).join(', ')}},\n`),
    '};\n',
  ].join('');

const carrBg1 = (name: string, idx: number[][]): string =>
  [`static const uint8_t ${name}[${STRIP_H}][256] = {\n`, ...idx.map((row) => `  {${row.join(',')}},\n`), '};\n'].join('');

const emitHud = (b: HudBake): string =>
  [
    HUD_HEAD,
    '// --- 2bpp BG sub-palettes (CGRAM[P*4..P*4+3]); text uses pal2, PC-name rows pal per char ---\n',
    '// ENEMY-NAME phase (regen f360):\n',
    carrPal('ctBattleHudPalEnemy', b.palE),
    '// COMMAND phase (p600):\n',
    carrPal('ctBattleHudPalCmd', b.palC),
    '// --- settled strip tilemaps (word 0x7800, rows 0-6) ---\n',
    "// ENEMY-NAME: box0='Gato' (enemy name, ROM CC/6500), box1=party (Crono/Marle + HP:MP + bar)\n",
    carrMap('ctBattleHudMapEnemy', b.mapE),
    '// COMMAND: box0=Crono cmd(hand+Att/Tech/Item), box1=Marle cmd, box2=party\n',
    carrMap('ctBattleHudMapCmd', b.mapC),
    '// --- full-strip BG1 CHROME: per-pixel index into ctBattleHudBg1Pal ---\n',
    '// Baked from the BG1-only oracle render (iso0): bodies (COLDATA gradient + fixed dither in\n',
    '// the BG1 tiles), per-box bevel frames, separators, outer frame. iso0 == normal byte-exact\n',
    '// at every non-glyph-ink strip pixel (probed both phases; battle_hud_render.md Q2), so\n',
    '// chrome + the BG3 glyphs on top reconstructs the strip 12288/12288.\n',
    `static const uint8_t ctBattleHudBg1Pal[${b.bg1Pal.length}][3] = {\n  `,
    b.bg1Pal.map(trip).join(', '),
    '\n};\n',
    '// ENEMY-NAME phase (2 boxes) chrome, baked from iso0 @f360:\n',
    carrBg1('ctBattleHudBg1Enemy', b.bg1IdxE),
    '// COMMAND phase (3 boxes) chrome, baked from iso0 @f600 (== committed p600 BG1):\n',
    carrBg1('ctBattleHudBg1Cmd', b.bg1IdxC),
    '#endif\n',
  ].join('');
export { emitHud };
