/* @layer shared-asset-extraction @kind logic @source Python rom_closure.sprite_fields, rom_closure.sprite_meta, rom_closure.sprite_pointers, rom_closure.blocks, rom_closure.sprite_tables, rom_closure.party_tables */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import { ptr24 } from './ptr24';
import type { RomTable } from './closure.type';
import { E4, SPRITE_RECS } from './closure-sprites.constants';
import type { SpriteFields } from './closure-sprites.type';
import { blocks } from './blocks';
import { maxOf } from './max-of';

const hex = (v: number, width: number): string => v.toString(16).toUpperCase().padStart(width, '0');

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

const spriteMeta = (rom: Uint8Array): [number, number, number, number] => {
  const at = (k: number): number => E4 + wordAt(rom, E4 + 0xffe0 + 2 * k);
  return [at(0), at(1), at(2), at(3)];
};

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

export { spriteTables };
