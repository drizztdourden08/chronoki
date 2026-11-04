/* @layer shared-asset-extraction @kind logic @source Python rom_closure_battle.small_tables, rom_closure_battle.battle_message, rom_closure_battle.anim_free_scan, rom_closure_battle.misc_tables */
import { byteAt, wordAt } from '../bytes/byte-reader';
import { ANIM_OPS, animHandler } from './battle-anim';
import { byteSpans, romLabel } from './byte-spans';
import type { RomTable } from './closure.type';
import { CC, CD, CE } from './battle-misc.constants';

const C1 = 0x010000;
const D1 = 0x110000;
const E1 = 0x210000;

const smallTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [];
  const t = (name: string, a: number, n: number): void => void out.push([name, a, a + n]);
  t('tech list bases and record offsets ($CC:F38C, $CC:F395)', CC + 0xf38c, 9 + 6);
  t('pose row layouts ($CC:F3B6, 14 x 6)', CC + 0xf3b6, 14 * 6);
  t('PC walk tables ($CC:F414-F693, 32 tracks)', CC + 0xf414, 0xf694 - 0xf414);
  t('arena offsets ($CC:F544, 8-bit)', CC + 0xf544, 256);
  t('status icon periods ($CC:F5FD, 8-bit)', CC + 0xf5fd, 256);
  t('bracket OAM ($CC:F604, 4 x 4)', CC + 0xf604, 16);
  t('weapon ranged ($CC:F63C, char)', CC + 0xf63c, 256);
  t('status icons ($CC:F6D4, 8-bit + 3 x 4)', CC + 0xf6d4, 256 + 16);
  t('status ramp bases ($CC:F754, word)', CC + 0xf754, 257);
  let a = CC + 0xf77f;
  while ((byteAt(rom, a) & 0x80) === 0) a += 4;
  t('status scan ($CC:F77F, 4-byte records to bit 7)', CC + 0xf77f, a + 1 - (CC + 0xf77f));
  t('effect frame bases and grid ($CC:F7C0, $CC:F820)', CC + 0xf7c0, 0x60 + 0x10);
  t('OAM templates ($CC:F84D)', CC + 0xf84d, 2 * 0x17 + 2 * 44);
  t('battle setup ($CC:F903, 8-bit)', CC + 0xf903, 256);
  t('pose destinations and uploads ($CC:F941-F977)', CC + 0xf941, 0xf977 - 0xf941);
  t('OAM name / attribute pairs ($CC:FAF3)', CC + 0xfaf3, 0xb0);
  t('pose classes, squares, move classes, co-actors, dwells ($CC:FB6F-FCCD)', CC + 0xfb6f, 0xfbce - 0xfb6f + 256);
  t('sheet offsets ($CC:FC1E, y)', CC + 0xfc1e, 2 * 256);
  t('enemy palette OBJ tail ($FF:9E0A, 3 words)', 0x3f9e0a, 6);
  return out;
};

const battleMessage = (rom: Uint8Array, start: number, seen: Set<number>): void => {
  let a = start;
  for (let i = 0; i < 256; i += 1) {
    seen.add(a);
    const v = byteAt(rom, a);
    a += 1;
    if (v === 0) return;
    if (v === 0x12) {
      seen.add(a);
      a += 1;
    }
  }
};

const animFreeScan = (rom: Uint8Array, h: number, seen: Set<number>): void => {
  let hb = C1 + h;
  for (let hop = 0; hop < 4; hop += 1) {
    let jumped = false;
    for (let i = 0; i < 0x100; i += 1) {
      for (let k = hb + i; k < hb + i + 5; k += 1) seen.add(k);
      const b = byteAt(rom, hb + i);
      if (b === 0xee && byteAt(rom, hb + i + 1) === 0x0f && byteAt(rom, hb + i + 2) === 0xa0) return;
      if (b === 0x4c) {
        if (byteAt(rom, hb + i + 1) === 0xbb && byteAt(rom, hb + i + 2) === 0x75) return;
        hb = C1 + wordAt(rom, hb + i + 1);
        jumped = true;
        break;
      }
      if (b === 0x60 || b === 0x6b) return;
    }
    if (!jumped) return;
  }
};

const miscTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [];
  const t = (name: string, a: number, n: number): void => void out.push([name, a, a + n]);
  const seen = new Set<number>();
  for (const tb of [CC + 0x3a09, CE + 0xef11, CC + 0xcbc9]) {
    const bank = tb & 0xff0000;
    for (let i = 0; i < 256; i += 1) {
      seen.add(tb + 2 * i);
      seen.add(tb + 2 * i + 1);
      battleMessage(rom, bank + wordAt(rom, tb + 2 * i), seen);
    }
  }
  for (let op = 0; op < ANIM_OPS; op += 1) animFreeScan(rom, animHandler(rom, op), seen);
  for (const [a, b] of byteSpans(seen)) out.push([`battle messages, handler scans ${romLabel(a)}`, a, b]);
  t('message dwells ($CD:019D, 8)', CD + 0x019d, 8);
  t('message sounds ($D1:EE99, 8-bit)', D1 + 0xee99, 256);
  t('tech names ($CC:15C4, 11 x 256)', CC + 0x15c4, 11 * 256);
  t('battle HUD setup ($CC:F837-FBE9: seats, rows, cursors, 8-bit indices)', CC + 0xf837, 0xfae9 + 256 - 0xf837);
  t("the boot's palettes and UI tiles ($FF:9C68-9D70)", 0x3f9c68, 0x9d70 - 0x9c68);
  t('HUD chrome ($D1:5800, 0x180; $D1:59FC, 6 x 14)', D1 + 0x5800, 0x5a50 - 0x5800);
  t('boot palettes ($D1:38F2, $D1:38FA)', D1 + 0x38f2, 14);
  t('boot palette ($D1:4D80, 16)', D1 + 0x4d80, 16);
  let a = E1 + 0xde00;
  while ((wordAt(rom, a) & 0x8000) === 0) a += 4;
  t('boss arenas ($E1:DE00, 4-byte records to bit 15, read whole)', E1 + 0xde00, a + 4 - (E1 + 0xde00));
  return out;
};

export { miscTables, smallTables };
