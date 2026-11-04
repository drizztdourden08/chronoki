/* @layer shared-asset-extraction @kind logic */
import { dec, hexN } from './shared/py-format';
import type { Sprite } from './shared/oam-decode';
import { NTILE, ACTORS, HEAD } from './battle-stance-emit.constants';

const objLine = (s: Sprite): string =>
  `  { ${dec(s.idx, 3)}, ${dec(s.x, 4)}, ${dec(s.y, 3)}, 0x${hexN(s.tile, 3)}, ${s.pal}, ${s.prio}, ${s.hflip}, ${s.vflip} },`;

const actorLine = (on: Sprite[], pal: number, name: string): string => {
  const grp = on.filter((s) => s.pal === pal);
  const ax = Math.min(...grp.map((s) => s.x));
  const ay = Math.min(...grp.map((s) => s.y));
  return `  { "${name}", ${pal}, ${dec(ax, 4)}, ${dec(ay, 3)}, ${grp.length} },`;
};

const palLine = (cgram: Uint8Array, p: number): string => {
  const vals: string[] = [];
  for (let c = 0; c < 16; c += 1) {
    const i = 128 + p * 16 + c;
    vals.push(`0x${hexN((cgram[i * 2] as number) | ((cgram[i * 2 + 1] as number) << 8), 4)}`);
  }
  const used = p === 1 || p === 5 || p === 6 ? ' USED' : '';
  return `  {${vals.join(',')}}, // pal${p}${used}`;
};

const emitStance = (on: Sprite[], vram: Uint8Array, cgram: Uint8Array): string => {
  const tiles: string[] = [];
  for (let t = 0; t < NTILE; t += 1) {
    const row = Array.from(vram.subarray(t * 32, t * 32 + 32), (b) => `0x${hexN(b, 2)}`).join(',');
    tiles.push(`  {${row}}, // 0x${hexN(t, 2)}`);
  }
  const lines = [
    ...HEAD,
    `#define CT_STANCE_NOBJ ${on.length}`,
    'static const CtStanceObj ctBattleStanceObj[CT_STANCE_NOBJ] = {',
    ...on.map(objLine),
    '};\n',
    '// Per-combatant partition (by palette). anchorX/Y = min corner of the sprite cluster.',
    '// Crono = ACTIVE PC (command open); Marle = WAITING PC (static); GATO = combat-idle enemy.',
    'typedef struct { const char* name; uint8_t pal; int16_t anchorX; uint8_t anchorY, nspr; } CtStanceActor;',
    `#define CT_STANCE_NACTOR ${ACTORS.length}`,
    'static const CtStanceActor ctBattleStanceActor[CT_STANCE_NACTOR] = {',
    ...ACTORS.map(([pal, name]) => actorLine(on, pal, name)),
    '};\n',
    `// OBJ 8x8 tiles 0x00..0x${hexN(NTILE - 1, 2)} (4bpp SNES planar, 32 B each) -- the battle-pose upload the`,
    '// module writes at boot (S1: OBJ VRAM 0x0000-0x1400/0x3000-0x3BFF rewritten; NOT the field sheet).',
    '// A 16x16 sprite of tile T uses 8x8 tiles T, T+1, T+0x10, T+0x11 (16-wide sheet).',
    `#define CT_STANCE_NTILE 0x${hexN(NTILE, 2)}`,
    'static const uint8_t ctBattleStanceObjTiles[CT_STANCE_NTILE][32] = {',
    ...tiles,
    '};\n',
    '// OBJ CGRAM palettes (BGR555 LE words). OBJ palette P = CGRAM entries 128 + P*16 + [0..15];',
    '// index 0 = transparent. Combatant palettes used: 5 (Crono), 6 (Marle), 1 (GATO).',
    'static const uint16_t ctBattleStanceObjPal[8][16] = {',
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((p) => palLine(cgram, p)),
    '};\n',
    '#endif // CT_BATTLE_STANCE_H',
  ];
  return `${lines.join('\n')}\n`;
};

export { emitStance };
