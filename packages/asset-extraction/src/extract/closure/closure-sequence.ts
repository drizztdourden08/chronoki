/* @layer shared-asset-extraction @kind logic @source Python rom_closure.sequence_table_entries, rom_closure.sequence_tables */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import { ptr24 } from './ptr24';
import type { RomTable } from './closure.type';
import { SEQ_TABLE } from './closure-sequence.constants';

const sequenceTableEntries = (rom: Uint8Array): { entries: [number, number][]; first: number } => {
  const firsts: number[] = [];
  for (let x = 0; x < 0x100; x += 3) if (byteAt(rom, SEQ_TABLE + x + 2) === 0xfe) firsts.push(wordAt(rom, SEQ_TABLE + x));
  const first = Math.min(...firsts);
  const entries: [number, number][] = [];
  for (let x = 0; x < first - 2; x += 3) {
    const o = ptr24(rom, SEQ_TABLE + x);
    if (o !== null) entries.push([x, o]);
  }
  return { entries, first };
};

const sequenceTables = (rom: Uint8Array, rawOffsets: Set<number>): RomTable[] => {
  const { entries, first } = sequenceTableEntries(rom);
  const fe = [...new Set(entries.filter(([, o]) => o >> 16 === 0x3e).map(([, o]) => o))].sort((a, b) => a - b);
  const out: RomTable[] = [['sequence packet table ($FE:0000)', SEQ_TABLE, SEQ_TABLE + first]];
  fe.forEach((o, i) => {
    if (!rawOffsets.has(o)) return;
    const end = i + 1 < fe.length ? (fe[i + 1] as number) : SEQ_TABLE + 0x10000;
    out.push([`sequence raw block ($FE:${(o & 0xffff).toString(16).toUpperCase().padStart(4, '0')})`, o, end]);
  });
  out.push(
    ['$D2:0000 (32 bytes the stages copy)', 0x120000, 0x120020],
    ['gate warp: radii, sprites, brightness ($FD:DD96-DE14)', 0x3ddd96, 0x3dde15],
    ['gate warp: the plot bit masks ($FD:ED79, 16)', 0x3ded79, 0x3ded89],
    ['gate warp: the colours ($FD:F001-F120)', 0x3df001, 0x3df121],
    ['gate warp: the colour scales ($FD:F181, 64)', 0x3df181, 0x3df1c1],
  );
  return out;
};

export { sequenceTables };
