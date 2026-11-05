/* @layer renderer-lib @kind logic */
import type { PackEntry, PackTables } from './title-pendulum.type';
import { PACK_DEFINES, PACK_TABLE } from './title-pendulum.constants';
import { packEntries } from './pack-entries';

const decoder = new TextDecoder();

const nameAt = (bytes: Uint8Array, at: number): string => decoder.decode(bytes.subarray(at + 1, at + 1 + (bytes[at] ?? 0)));

const tableData = (view: DataView, bytes: Uint8Array, entry: PackEntry): Uint8Array | null => {
  const head = entry.at + ((1 + (bytes[entry.at] ?? 0) + 3) & ~3);
  const end = entry.at + entry.length;
  if (head + 16 > end) return null;
  const size = view.getUint32(head, true);
  const data = head + 16 + view.getUint32(head + 12, true) * 4;
  return data + size === end ? bytes.subarray(data, end) : null;
};

const definesOf = (view: DataView, bytes: Uint8Array, entry: PackEntry): Map<string, number> => {
  const defines = new Map<string, number>();
  const end = entry.at + entry.length;
  const count = entry.length >= 4 ? view.getUint32(entry.at, true) : 0;
  let at = entry.at + 4;
  for (let index = 0; index < count; index += 1) {
    const valueAt = at + 1 + (bytes[at] ?? 0);
    if (valueAt + 8 > end) break;
    defines.set(nameAt(bytes, at), Number(view.getBigInt64(valueAt, true)));
    at = valueAt + 8;
  }
  return defines;
};

const readPackTables = (bytes: Uint8Array, wanted: readonly string[]): PackTables | null => {
  const entries = packEntries(bytes);
  if (!entries) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tables = new Map<string, Uint8Array>();
  for (const entry of entries.filter((candidate) => candidate.type === PACK_TABLE && candidate.length > 0)) {
    const name = nameAt(bytes, entry.at);
    const data = wanted.includes(name) ? tableData(view, bytes, entry) : null;
    if (data) tables.set(name, data);
  }
  const defineEntry = entries.find((candidate) => candidate.type === PACK_DEFINES);
  return { tables, defines: defineEntry ? definesOf(view, bytes, defineEntry) : new Map() };
};

export { readPackTables };
