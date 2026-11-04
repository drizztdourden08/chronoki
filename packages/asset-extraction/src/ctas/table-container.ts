/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';
import {
  CTAS_DIR_ENTRY_BYTES,
  CTAS_HEADER_BYTES,
  CTAS_MAGIC,
  CTAS_PACK_VERSION,
  TABLE_ENTRY_TYPES,
  T_TABLE_HEADER,
} from './ctas.constants';
import type { CtasEntry } from './ctas.type';
import { readCtas } from './read-ctas';
import { isCtas } from './is-ctas';

const alignPad = (at: number): number => (8 - (at % 8)) % 8;

const tableContainer = (entries: CtasEntry[]): Uint8Array => {
  const head = createLeWriter();
  head.bytes(Uint8Array.from(CTAS_MAGIC));
  head.u32(CTAS_PACK_VERSION);
  head.u32(entries.length);
  const blobs = createLeWriter();
  const base = CTAS_HEADER_BYTES + CTAS_DIR_ENTRY_BYTES * entries.length;
  for (const e of entries) {
    blobs.zeros(alignPad(blobs.length()));
    head.u32(e.type);
    head.u32(e.id);
    head.u32(base + blobs.length());
    head.u32(e.blob.length);
    blobs.bytes(e.blob);
  }
  head.bytes(blobs.toBytes());
  return head.toBytes();
};

const mergeTablesInto = (assets: Uint8Array, pack: Uint8Array): Uint8Array => {
  if (!isCtas(assets)) throw new Error('the assets are not a CTAS container');
  const isTable = (e: CtasEntry): boolean => TABLE_ENTRY_TYPES.includes(e.type);
  const keep = readCtas(assets).filter((e) => !isTable(e));
  const add = readCtas(pack).filter(isTable);
  if (!add.some((e) => e.type === T_TABLE_HEADER)) throw new Error('the pack holds no tables');
  const entries = [...keep, ...add];
  const out = createLeWriter();
  out.bytes(assets.slice(0, 8));
  out.u32(entries.length);
  const blobs = createLeWriter();
  const base = CTAS_HEADER_BYTES + CTAS_DIR_ENTRY_BYTES * entries.length;
  for (const e of entries) {
    if (isTable(e)) blobs.zeros(alignPad(base + blobs.length()));
    out.u32(e.type);
    out.u32(e.id);
    out.u32(base + blobs.length());
    out.u32(e.blob.length);
    blobs.bytes(e.blob);
  }
  out.bytes(blobs.toBytes());
  return out.toBytes();
};

export { mergeTablesInto, tableContainer };
