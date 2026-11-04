/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { LOC_RECORDS, TILESET_LISTS, MAP_PTRS, ASM_PTRS, ASM3_PTRS, TS_PTRS, SCRIPT_PTRS } from './closure-locations.constants';
import { sequenceStreams } from './sequence-streams';

const ptr24 = (rom: Uint8Array, at: number): number | null => {
  const bank = rom[at + 2] as number;
  return bank < 0xc0 ? null : ((bank - 0xc0) << 16) | u16(rom, at);
};

const locationIndices = (rom: Uint8Array) => {
  const ts = new Set<number>();
  const b3s = new Set<number>();
  const idxs = new Set<number>();
  const maps = new Set<number>();
  const scripts = new Set<number>();
  for (let loc = 0; loc < 512; loc += 1) {
    const r = LOC_RECORDS + loc * 14;
    const t = rom[r + 1] as number;
    const b3 = rom[r + 2] as number;
    if (t !== 0xff) {
      ts.add(t);
      for (let i = 0; i < 8; i += 1) {
        const ix = rom[TILESET_LISTS + t * 8 + i] as number;
        if (ix !== 0xff) idxs.add(ix);
      }
    }
    if (b3 !== 0xff) b3s.add(b3);
    maps.add(u16(rom, r + 4));
    scripts.add(u16(rom, r + 8));
  }
  return { ts, b3s, idxs, maps, scripts };
};

const streamsOf = (rom: Uint8Array, table: number, ids: Iterable<number>): Set<number> => {
  const out = new Set<number>();
  for (const i of ids) {
    const o = ptr24(rom, table + 3 * i);
    if (o !== null) out.add(o);
  }
  return out;
};

const locationStreams = (rom: Uint8Array): Map<string, Set<number>> => {
  const { ts, b3s, idxs, maps, scripts } = locationIndices(rom);
  return new Map([
    ['location maps', streamsOf(rom, MAP_PTRS, maps)],
    ['location tilesets', streamsOf(rom, TS_PTRS, new Set([...idxs, ...b3s]))],
    ['location assemblies', streamsOf(rom, ASM_PTRS, ts)],
    ['location BG3 assemblies', streamsOf(rom, ASM3_PTRS, b3s)],
    ['location scripts', streamsOf(rom, SCRIPT_PTRS, scripts)],
  ]);
};

export { ptr24, locationStreams };
