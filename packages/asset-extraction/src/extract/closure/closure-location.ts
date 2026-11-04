/* @layer shared-asset-extraction @kind logic @source Python rom_closure.ptr24, rom_closure.location_indices, rom_closure.colour_slot_tables, rom_closure.location_tables */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import type { RomTable } from './closure.type';
import { LOC_RECORDS, TILESET_LISTS, MAP_PTRS, ASM_PTRS, ASM3_PTRS, TS_PTRS, SCRIPT_PTRS, SCENE_PALETTES, EXITS, TREASURE } from './closure-location.constants';
import type { LocationIndices } from './closure-location.type';

const maxOf = (values: Iterable<number>): number => Math.max(...values);

const locationIndices = (rom: Uint8Array): LocationIndices => {
  const r: LocationIndices = { ts: new Set(), b3s: new Set(), idxs: new Set(), maps: new Set(), scripts: new Set() };
  for (let loc = 0; loc < 512; loc += 1) {
    const o = LOC_RECORDS + loc * 14;
    const t = byteAt(rom, o + 1);
    const b3 = byteAt(rom, o + 2);
    if (t !== 0xff) {
      r.ts.add(t);
      for (let i = 0; i < 8; i += 1) {
        const ix = byteAt(rom, TILESET_LISTS + t * 8 + i);
        if (ix !== 0xff) r.idxs.add(ix);
      }
    }
    if (b3 !== 0xff) r.b3s.add(b3);
    r.maps.add(wordAt(rom, o + 4));
    r.scripts.add(wordAt(rom, o + 8));
  }
  return r;
};

const colourSlotTables = (rom: Uint8Array): [number, number] => {
  let lo: number | null = null;
  let hi: number | null = null;
  const d = (i: number): number => byteAt(rom, 0x3dfa77 + i);
  for (let loc = 0; loc < 512; loc += 1) {
    const ti = (byteAt(rom, LOC_RECORDS + loc * 14 + 3) << 1) & 0xff;
    let x = wordAt(rom, 0x3df9c7 + ti);
    for (let n = 0; n < 6; n += 1) {
      const m = d(x) & 0xf0;
      if (m === 0) {
        x += 1;
        continue;
      }
      const r0 = d(x);
      const cnt = d(x + 2);
      x += 4;
      if (m !== 0x10 && m !== 0x80) continue;
      const base = d(x) | (d(x + 1) << 8);
      x += 3;
      const frames = (r0 & 0x0f) + 1;
      let sels: number[];
      if (m === 0x10) {
        sels = Array.from({ length: frames }, (_, k) => k);
      } else {
        sels = Array.from({ length: frames }, (_, k) => d(x + k));
        x += frames;
      }
      const step = (cnt * 2) & 0xff;
      const a = base + Math.min(...sels) * step;
      const b = base + Math.max(...sels) * step + 2 * (cnt || 0x10000);
      lo = lo === null ? a : Math.min(lo, a);
      hi = hi === null ? b : Math.max(hi, b);
    }
  }
  return [0x360000 + (lo as number), 0x360000 + (hi as number)];
};

const locationTables = (rom: Uint8Array): RomTable[] => {
  const { ts, b3s, idxs, maps, scripts } = locationIndices(rom);
  const pals = new Set<number>();
  for (let loc = 0; loc < 512; loc += 1) pals.add(byteAt(rom, LOC_RECORDS + loc * 14 + 3));
  const ptrEnd = (base: number): number => maxOf(Array.from({ length: 513 }, (_, i) => wordAt(rom, base + 2 * i)));
  const exitsEnd = ptrEnd(EXITS);
  const treasureEnd = ptrEnd(TREASURE);
  const [csLo, csHi] = colourSlotTables(rom);
  return [
    ['scene palettes ($F6:24C0, 0xD2 each)', SCENE_PALETTES, SCENE_PALETTES + 0xd2 * (maxOf(pals) + 1)],
    ['colour-slot colour tables (bank F6, their closure)', csLo, csHi],
    ['exits ($E5:0000: pointers, then records)', EXITS, EXITS + exitsEnd],
    ['treasure ($F5:F000: pointers, then records)', TREASURE, 0x350000 + treasureEnd],
    ['location tileset lists ($F6:1C00, 8 per tileset)', TILESET_LISTS, TILESET_LISTS + 8 * (maxOf(ts) + 1)],
    ['location map pointers ($F6:1E00)', MAP_PTRS, MAP_PTRS + 3 * (maxOf(maps) + 1)],
    ['location assembly pointers ($F6:2100)', ASM_PTRS, ASM_PTRS + 3 * (maxOf(ts) + 1)],
    ['location BG3 assembly pointers ($F6:21C0)', ASM3_PTRS, ASM3_PTRS + 3 * (maxOf(b3s) + 1)],
    ['location tileset pointers ($F6:2220)', TS_PTRS, TS_PTRS + 3 * (maxOf([...idxs, ...b3s]) + 1)],
    ['location script pointers ($FC:F9F0)', SCRIPT_PTRS, SCRIPT_PTRS + 3 * (maxOf(scripts) + 1)],
  ];
};

export { locationTables };
