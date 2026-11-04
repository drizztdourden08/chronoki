/* @layer shared-asset-extraction @kind logic @source Python rom_closure_battle.small_tables, rom_closure_battle.battle_message, rom_closure_battle.anim_free_scan, rom_closure_battle.misc_tables */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import { animHandler } from './anim-handler';
import { ANIM_OPS } from './battle-anim.constants';
import { byteSpans } from './byte-spans';
import { romLabel } from './rom-label';
import type { RomTable } from './closure.type';
import { CC, CD, CE } from './battle-misc.constants';

const C1 = 0x010000;
const D1 = 0x110000;
const E1 = 0x210000;

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

const isLoopTail = (rom: Uint8Array, at: number, b: number): boolean =>
  b === 0xee && byteAt(rom, at + 1) === 0x0f && byteAt(rom, at + 2) === 0xa0;

const jumpTarget = (rom: Uint8Array, at: number): number | null =>
  byteAt(rom, at + 1) === 0xbb && byteAt(rom, at + 2) === 0x75 ? null : C1 + wordAt(rom, at + 1);

const scanHandler = (rom: Uint8Array, hb: number, seen: Set<number>): number | null => {
  for (let i = 0; i < 0x100; i += 1) {
    for (let k = hb + i; k < hb + i + 5; k += 1) seen.add(k);
    const b = byteAt(rom, hb + i);
    if (isLoopTail(rom, hb + i, b)) return null;
    if (b === 0x4c) return jumpTarget(rom, hb + i);
    if (b === 0x60 || b === 0x6b) return null;
  }
  return null;
};

const animFreeScan = (rom: Uint8Array, h: number, seen: Set<number>): void => {
  let hb = C1 + h;
  for (let hop = 0; hop < 4; hop += 1) {
    const next = scanHandler(rom, hb, seen);
    if (next === null) return;
    hb = next;
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

export { miscTables };
