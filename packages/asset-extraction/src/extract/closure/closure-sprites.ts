/* @layer shared-asset-extraction @kind logic */
import { byteAt, wordAt } from '../bytes/byte-reader';
import { ptr24 } from './closure-location';
import type { RomTable } from './closure.type';

const E4 = 0x240000;
/** [base, stride, count] of the PCs'/NPCs' and the enemies' sprite records. */
const SPRITE_RECS: [number, number, number][] = [
  [E4 + 0xf000, 5, Math.floor((0xf600 - 0xf000) / 5)],
  [E4 + 0xf600, 10, Math.floor((0xffe0 - 0xf600) / 10)],
];

const hex = (v: number, width: number): string => v.toString(16).toUpperCase().padStart(width, '0');
const maxOf = (values: Iterable<number>): number => Math.max(...values);

interface SpriteFields {
  g: Set<number>;
  a: Set<number>;
  p: Set<number>;
  n: Set<number>;
}

/** rom_closure.sprite_fields: the gfx, assembly, palette and anim ids any sprite record names. */
const spriteFields = (rom: Uint8Array): SpriteFields => {
  const r: SpriteFields = { g: new Set(), a: new Set(), p: new Set(), n: new Set() };
  for (const [base, stride, count] of SPRITE_RECS) {
    for (let i = 0; i < count; i += 1) {
      const o = base + stride * i;
      r.g.add(byteAt(rom, o));
      r.a.add(byteAt(rom, o + 1));
      r.p.add(byteAt(rom, o + 2));
      r.n.add(byteAt(rom, o + 3));
    }
  }
  return r;
};

/** rom_closure.sprite_meta: the gfx, assembly, frame and duration pointer tables' offsets. */
const spriteMeta = (rom: Uint8Array): [number, number, number, number] => {
  const at = (k: number): number => E4 + wordAt(rom, E4 + 0xffe0 + 2 * k);
  return [at(0), at(1), at(2), at(3)];
};

/** rom_closure.sprite_pointers: ({gfx id: offset}, {asm id: offset}) of every id the records name. */
const spritePointers = (rom: Uint8Array): [Map<number, number>, Map<number, number>] => {
  const [gfxT, asmT] = spriteMeta(rom);
  const { g, a } = spriteFields(rom);
  const pick = (ids: Set<number>, table: number): Map<number, number> => {
    const m = new Map<number, number>();
    for (const i of ids) {
      const o = ptr24(rom, table + 3 * i);
      if (o !== null) m.set(i, o);
    }
    return m;
  };
  return [pick(g, gfxT), pick(a, asmT)];
};

/** rom_closure.blocks: each offset to the next one in its own 64 KB bank (or the bank's end), the raw data a pointer table names. */
const blocks = (offsets: Iterable<number>): [number, number][] => {
  const srt = [...new Set(offsets)].sort((x, y) => x - y);
  return srt.map((o, i) => {
    const bankEnd = Math.floor(o / 0x10000) * 0x10000 + 0x10000;
    const next = srt[i + 1];
    return [o, next !== undefined && next < bankEnd ? next : bankEnd];
  });
};

/** rom_closure.sprite_tables: the sprite system's tables (records, meta, pointer tables, palettes, frames, raw tiles, assemblies). */
const spriteTables = (rom: Uint8Array, rawOffsets: Set<number>): RomTable[] => {
  const [gfxT, asmT, fpT, dpT] = spriteMeta(rom);
  const { g, a, p, n } = spriteFields(rom);
  const nmax = maxOf(n);
  const fp = Array.from({ length: nmax + 2 }, (_, i) => wordAt(rom, fpT + 2 * i));
  const dp = Array.from({ length: nmax + 2 }, (_, i) => wordAt(rom, dpT + 2 * i));
  const out: RomTable[] = [
    ['sprite records: PCs and NPCs ($E4:F000, 5 each)', E4 + 0xf000, E4 + 0xf000 + 5 * (SPRITE_RECS[0] as number[])[2]!],
    ['sprite records: enemies ($E4:F600, 10 each, the 8-bit id: to $E5:0000)', E4 + 0xf600, E4 + 0xf600 + 10 * 256],
    ['sprite meta ($E4:FFE0)', E4 + 0xffe0, E4 + 0xffe8],
    ['sprite palettes ($E4:0000, 24 each)', E4, E4 + 24 * (maxOf(p) + 1)],
    ['sprite gfx pointers', gfxT, gfxT + 3 * (maxOf(g) + 1)],
    ['sprite assembly pointers', asmT, asmT + 3 * (maxOf(a) + 1)],
    ['sprite frame-table pointers', fpT, fpT + 2 * (nmax + 2)],
    ['sprite duration-table pointers', dpT, dpT + 2 * (nmax + 2)],
    ['sprite frame tables (bank E4)', E4 + Math.min(...fp), E4 + maxOf(fp)],
    ['sprite duration tables (bank E4)', E4 + Math.min(...dp), E4 + maxOf(dp)],
  ];
  const [gp, ap] = spritePointers(rom);
  const label = (s0: number): string => `$${hex(0xc0 + (s0 >> 16), 2)}:${hex(s0 & 0xffff, 4)}`;
  for (const [s0, e0] of blocks([...gp.values()].filter((o) => rawOffsets.has(o)))) out.push([`sprite raw tiles (${label(s0)})`, s0, e0]);
  for (const [s0, e0] of blocks(ap.values())) out.push([`sprite assembly (${label(s0)})`, s0, e0]);
  return out;
};

/** rom_closure.party_tables: the walk-anim jump table and handlers, the triple-tech tables, the PC bit table and the weapon palettes. */
const partyTables = (rom: Uint8Array): RomTable[] => {
  const cd6cec = 0x0d6cec;
  return [
    ['walk-anim jump table ($C0:9FF7, X & 7E)', 0x009ff7, 0x009ff7 + 0x80],
    ['walk-anim handlers ($C0:A079-A171, their operands)', 0x00a079, 0x00a171],
    ['triple-tech members ($CC:2953, 5 x 3)', 0x0c2953, 0x0c2953 + 15],
    ['triple-tech masks ($CC:2983, 5)', 0x0c2983, 0x0c2983 + 5],
    ['PC bit table ($FF:F9BB, 8-bit index)', 0x3ff9bb, 0x3ff9bb + 0x100],
    ['weapon palette index ($CD:6CEC, 8-bit index)', cd6cec, cd6cec + 0x100],
    ['weapon palettes ($D1:4B00, 6 each)', 0x114b00, 0x114b00 + 6 * (maxOf(rom.subarray(cd6cec, cd6cec + 0x100)) + 1)],
  ];
};

export { blocks, partyTables, spriteTables };
