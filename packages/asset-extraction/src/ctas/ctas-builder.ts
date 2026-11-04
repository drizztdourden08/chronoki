/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';
import { CTAS_ASSETS_VERSION, CTAS_DIR_ENTRY_BYTES, CTAS_HEADER_BYTES, CTAS_MAGIC } from './ctas.constants';
import type { CtasBuilder, CtasEntry } from './ctas.type';

/**
 * The CTAS v3 asset container, laid out as extract_assets.build() does: 'CTAS', version, count, the
 * directory of {type, id, offset, length} u32 records, then the blobs back to back (no padding).
 * Stages add entries in any order; the packers' order is the file order.
 */
const createCtasBuilder = (version: number = CTAS_ASSETS_VERSION): CtasBuilder => {
  const entries: CtasEntry[] = [];
  const add = (type: number, id: number, blob: Uint8Array): void => {
    entries.push({ type, id, blob });
  };
  const build = (): Uint8Array => {
    const out = createLeWriter();
    out.bytes(Uint8Array.from(CTAS_MAGIC));
    out.u32(version);
    out.u32(entries.length);
    let offset = CTAS_HEADER_BYTES + entries.length * CTAS_DIR_ENTRY_BYTES;
    for (const e of entries) {
      out.u32(e.type);
      out.u32(e.id);
      out.u32(offset);
      out.u32(e.blob.length);
      offset += e.blob.length;
    }
    for (const e of entries) out.bytes(e.blob);
    return out.toBytes();
  };
  return {
    add,
    addAll: (more) => {
      for (const e of more) add(e.type, e.id, e.blob);
    },
    count: () => entries.length,
    countOfType: (type) => entries.filter((e) => e.type === type).length,
    build,
  };
};

export { createCtasBuilder };
