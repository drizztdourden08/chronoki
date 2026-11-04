/* @layer shared-asset-extraction @kind logic */
import { DIGIT_PAL } from './fx-head.constants';
import { word } from './cg-word';
import { w4 } from './hex-word';
import { HEAL_PAL_FILL_NOTE } from './fx-pal-note.constants';

const countOf = (data: Uint8Array, at: number, len: number): number => {
  let n = 0;
  const first = data[at] as number;
  for (let i = 0; i + len <= data.length; i += 1) {
    if (data[i] !== first) continue;
    let ok = true;
    for (let j = 1; j < len; j += 1) {
      if (data[i + j] !== data[at + j]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      n += 1;
      i += len - 1;
    }
  }
  return n;
};

const palText = (rom: Uint8Array, cgram: Uint8Array): string => {
  const out: string[] = [];
  const W = (s: string): void => {
    out.push(s);
  };
  W(`// OBJ palette ${DIGIT_PAL} (BGR555 LE). Digits use idx 1 (white fill 0x7FFF) + 2/3 (outline); 0 = clear.\n`);
  W('static const uint16_t ctBattleFxDigitPal[16] = {');
  const dpal = Array.from({ length: 16 }, (_, c) => word(cgram, 128 + DIGIT_PAL * 16 + c));
  W(dpal.map((v) => `0x${w4(v)}`).join(','));
  W('};\n');

  const sub = (a: number): number[] => [0, 1, 2, 3].map((i) => (rom[a + 2 * i] as number) | ((rom[a + 2 * i + 1] as number) << 8));
  const dmg = sub(0x114d80);
  const heal = sub(0x114d88);
  if (dmg.some((v, i) => v !== dpal[i])) throw new Error('D1/4D80 is not the baked damage palette');
  for (const a of [0x114d80, 0x114d88]) {
    if (countOf(rom, a, 8) !== 1) throw new Error(`the sub-palette at ${a.toString(16).toUpperCase()} is not unique in the ROM`);
  }
  W('// THE HEAL/RESTORE NUMBER IS GREEN, and it is a different OBJ PALETTE, not a different tile. C1/5ADB\n');
  W('// (ShowDamage) defaults the OAM attribute to 0x31 (`15B49 LDA #31 / STA $8C` -> prio 3, OBJ pal 0) and\n');
  W('// swaps it to 0x39 (pal 4) for the RESTORE kinds -- `15B99 CMP #03 / BEQ` keeps 0x31 for ordinary damage,\n');
  W('// `15B9D CMP #01 / BEQ 15BAD` and `15BA6 CMP #02 / BNE` route HP-restore (kind 1, writer C1/DAC9 for an\n');
  W('// item, C1/DDA0 for a healing tech) and MP-restore (kind 2, C1/DB54) to `15BAD LDA #39`. The two 4-colour\n');
  W('// digit sub-palettes are adjacent in ROM and each occurs EXACTLY ONCE in the whole 4 MB image:\n');
  W(`//   D1/4D80 = ${dmg.map(w4).join(' ')}   damage  (== ctBattleFxDigitPal[0..3], already baked)\n`);
  W(`//   D1/4D88 = ${heal.map(w4).join(' ')}   restore (idx1 = 0x${w4(heal[1] as number)} -> RGB 132,255,148 = the green ink)\n`);
  W("// Verified on a rendered oracle frame, not just in ROM: the Elixir's HP number over Marle draws GREEN\n");
  W('// (gato_elixir.state, popup window f532-f590 measured by `--monitor "A3D1:1"`).\n');
  W('// Indices 4-15 are never reached by a digit or the MISS glyph -- the ten digit tiles use colour indices\n');
  W('// 0,1,2,3 ONLY (counted over ctBattleFxDigitTile: 159/159/93/229 pixels, nothing above 3) -- so they are\n');
  W(HEAL_PAL_FILL_NOTE);
  W('// all-white hurt flash on a damage frame, the heal-effect sprite colours on a heal frame).\n');
  W('static const uint16_t ctBattleFxHealPal[16] = {');
  W([...heal, ...dpal.slice(4)].map((v) => `0x${w4(v)}`).join(','));
  W('};\n\n');
  return out.join('');
};

export { palText };
