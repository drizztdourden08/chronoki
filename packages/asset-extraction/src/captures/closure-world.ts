/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { ptr24 } from './closure-locations';

const E4 = 0x240000;
const C2 = 0x020000;
const C6 = 0x060000;
const FF = 0x3f0000;
const D1 = 0x110000;
const CD = 0x0d0000;
/** The sprite records: the PCs' and NPCs' (5 bytes) and the enemies' (10 bytes), as [base, stride, count]. */
const SPRITE_RECS: [number, number, number][] = [
  [E4 + 0xf000, 5, Math.floor((0xf600 - 0xf000) / 5)],
  [E4 + 0xf600, 10, Math.floor((0xffe0 - 0xf600) / 10)],
];

/** rom_closure.py sprite_streams: every gfx pointer the sprite records name (through the meta at $E4:FFE0). */
const spriteStreams = (rom: Uint8Array): Map<string, Set<number>> => {
  const gfxTable = E4 + u16(rom, E4 + 0xffe0);
  const gfx = new Set<number>();
  for (const [base, stride, count] of SPRITE_RECS) for (let i = 0; i < count; i += 1) gfx.add(rom[base + stride * i] as number);
  const out = new Set<number>();
  for (const i of gfx) {
    const o = ptr24(rom, gfxTable + 3 * i);
    if (o !== null) out.add(o);
  }
  return new Map([['sprite sheets ($E4:FFE0 gfx table)', out]]);
};

/** rom_closure.py menu_streams: the exchange's BG3 characters. */
const menuStreams = (): Map<string, Set<number>> => new Map([['menu LZ streams', new Set([FF + 0xe8dc])]]);

const WORLD_PACKET_TABLES = [0xfdf0, 0xfe20, 0xfea0, 0xff00, 0xff20, 0xff40, 0xff80, 0xffa0, 0xffc0, 0xffe0, 0x10000];
const GAUGE_PACKETS: [number, number][] = [[0, 0xc3], [1, 0xc6], [2, 0xc6]];

/** rom_closure.py world_streams: every world packet the ten pointer tables name, and the time gauge's three. */
const worldStreams = (rom: Uint8Array): Map<string, Set<number>> => {
  const packets = new Set<number>();
  for (let k = 0; k + 1 < WORLD_PACKET_TABLES.length; k += 1) {
    const a = WORLD_PACKET_TABLES[k] as number;
    const b = WORLD_PACKET_TABLES[k + 1] as number;
    for (let e = C6 + a; e < C6 + b - 2; e += 3) {
      const o = ptr24(rom, e);
      if (o !== null) packets.add(o);
    }
  }
  const gauge = new Set(GAUGE_PACKETS.map(([i, bank]) => ((bank - 0xc0) << 16) | u16(rom, C2 + 0x7220 + 4 * i)));
  return new Map([
    ['world packets ($C6:FDF0-FFFF tables)', packets],
    ['time gauge packets (C2:7220)', gauge],
  ]);
};

/** rom_closure_battle.py stage_cfgs: the $987E index of every anim config a battle action can stage, with the word table it reads. */
const effectFrameStreams = (rom: Uint8Array): Set<number> => {
  const out = new Set<number>();
  const add = (t1: number, idx: number): void => void out.add(D1 + u16(rom, t1 + 2 * idx));
  for (const base of [CD + 0x5526, CD + 0x5c26, CD + 0x45a6]) {
    for (let i = 0; i < 256; i += 1) add(D1 + 0x0060, rom[base + 7 * i + 3] as number);
  }
  for (const base of [CD + 0x4926, CD + 0x4f26]) {
    for (let i = 0; i < 256; i += 1) add(D1 + 0x0060, rom[base + 6 * i + 3] as number);
  }
  for (const base of [CD + 0x4015, CD + 0x401a, CD + 0x401f]) {
    for (let i = 0; i < 256; i += 1) add(D1 + 0x0000, rom[base + 15 * i + 2] as number);
  }
  return out;
};

/** rom_closure_battle.py stage_streams. */
const stageStreams = (rom: Uint8Array): Map<string, Set<number>> =>
  new Map([['battle effect frames ($D1 words, C1/486A)', effectFrameStreams(rom)]]);

export { menuStreams, spriteStreams, stageStreams, worldStreams };
