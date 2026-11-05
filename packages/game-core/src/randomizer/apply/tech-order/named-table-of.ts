/* @layer bridge-wasm @kind logic */
import { readPackEntries } from '../../checks/read-pack-entries';
import { NAMED_TABLE_HEADER_BYTES, NAMED_TABLE_TYPE } from './tech-order.constants';
import type { NamedTable } from './tech-order.type';

const NAME_ALIGN = 4;

const sizeAtOf = (nameBytes: number): number => Math.ceil((1 + nameBytes) / NAME_ALIGN) * NAME_ALIGN;

const u32 = (pack: Uint8Array, at: number): number =>
  ((pack[at] ?? 0) | ((pack[at + 1] ?? 0) << 8) | ((pack[at + 2] ?? 0) << 16) | ((pack[at + 3] ?? 0) << 24)) >>> 0;

const nameMatches = (pack: Uint8Array, start: number, name: string): boolean =>
  pack[start] === name.length && [...name].every((ch, i) => pack[start + 1 + i] === ch.charCodeAt(0));

const namedTableOf = (pack: Uint8Array, name: string): NamedTable | null => {
  const entry = readPackEntries(pack).find((e) => e.type === NAMED_TABLE_TYPE && nameMatches(pack, e.start, name));
  if (entry === undefined) return null;
  const sizeAt = entry.start + sizeAtOf(name.length);
  const size = u32(pack, sizeAt);
  const at = sizeAt + NAMED_TABLE_HEADER_BYTES;
  return at + size <= entry.start + entry.length ? { at, size } : null;
};

export { namedTableOf };
