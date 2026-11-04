/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { ptr24 } from './closure-locations';
import { E4, C2, C6, FF, D1, CD, SPRITE_RECS, WORLD_PACKET_TABLES, GAUGE_PACKETS } from './closure-world.constants';

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

const menuStreams = (): Map<string, Set<number>> => new Map([['menu LZ streams', new Set([FF + 0xe8dc])]]);

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

const stageStreams = (rom: Uint8Array): Map<string, Set<number>> =>
  new Map([['battle effect frames ($D1 words, C1/486A)', effectFrameStreams(rom)]]);

export { menuStreams, spriteStreams, stageStreams, worldStreams };
