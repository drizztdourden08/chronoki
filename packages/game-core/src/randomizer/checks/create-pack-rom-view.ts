/* @layer bridge-wasm @kind logic */
import { CTAS_ENTRY_BYTES, CTAS_HEADER_BYTES, CTAS_MAGIC, CTAS_TYPE_TABLE } from './checks.constants';

type RomView = (rom: number) => number | null;
type TableSpan = { id: number; start: number; length: number };

const u32 = (d: Uint8Array, o: number): number => (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> 0;

const readTables = (pack: Uint8Array): TableSpan[] => {
  const count = u32(pack, 8);
  const tables: TableSpan[] = [];
  for (let i = 0; i < count; i += 1) {
    const at = CTAS_HEADER_BYTES + i * CTAS_ENTRY_BYTES;
    if (at + CTAS_ENTRY_BYTES > pack.length) break;
    const start = u32(pack, at + 8);
    const length = u32(pack, at + 12);
    if (u32(pack, at) === CTAS_TYPE_TABLE && start + length <= pack.length) tables.push({ id: u32(pack, at + 4), start, length });
  }
  return tables;
};

const createPackRomView = (pack: Uint8Array): RomView | null => {
  if (pack.length < CTAS_HEADER_BYTES || u32(pack, 0) !== CTAS_MAGIC) return null;
  const tables = readTables(pack);
  return (rom) => {
    const t = tables.find((s) => rom >= s.id && rom < s.id + s.length);
    return t ? pack[t.start + rom - t.id] : null;
  };
};

export type { RomView };
export { createPackRomView };
