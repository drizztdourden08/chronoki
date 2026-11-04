/* @layer bridge-wasm @kind logic */
import { CTAS_ENTRY_BYTES, CTAS_HEADER_BYTES, CTAS_MAGIC } from './checks.constants';
import type { PackEntry } from './read-pack-entries.type';

const byteAt = (d: Uint8Array, o: number): number => d[o] ?? 0;

const u32 = (d: Uint8Array, o: number): number =>
  (byteAt(d, o) | (byteAt(d, o + 1) << 8) | (byteAt(d, o + 2) << 16) | (byteAt(d, o + 3) << 24)) >>> 0;

const readPackEntries = (pack: Uint8Array): PackEntry[] => {
  if (pack.length < CTAS_HEADER_BYTES || u32(pack, 0) !== CTAS_MAGIC) return [];
  const count = u32(pack, 8);
  const entries: PackEntry[] = [];
  for (let i = 0; i < count; i += 1) {
    const at = CTAS_HEADER_BYTES + i * CTAS_ENTRY_BYTES;
    if (at + CTAS_ENTRY_BYTES > pack.length) break;
    const start = u32(pack, at + 8);
    const length = u32(pack, at + 12);
    if (start + length <= pack.length) entries.push({ type: u32(pack, at), id: u32(pack, at + 4), start, length });
  }
  return entries;
};

export { readPackEntries };
