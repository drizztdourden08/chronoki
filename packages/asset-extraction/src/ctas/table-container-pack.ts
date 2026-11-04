/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';
import { CTAS_DIR_ENTRY_BYTES, CTAS_HEADER_BYTES, CTAS_MAGIC, CTAS_PACK_VERSION } from './ctas.constants';
import type { CtasEntry } from './ctas.type';
import { alignPad } from './align-pad';

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

export { tableContainer };
