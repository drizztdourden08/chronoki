/* @layer shared-asset-extraction @kind logic */
import { CTAS_DIR_ENTRY_BYTES, CTAS_HEADER_BYTES, CTAS_MAGIC } from './ctas.constants';
import type { CtasDirEntry, CtasEntry } from './ctas.type';

const isCtas = (data: Uint8Array): boolean => CTAS_MAGIC.every((b, i) => data[i] === b);

const readDirectory = (data: Uint8Array): CtasDirEntry[] => {
  if (!isCtas(data)) throw new Error('not a CTAS container');
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const count = view.getUint32(8, true);
  const dir: CtasDirEntry[] = [];
  for (let k = 0; k < count; k += 1) {
    const at = CTAS_HEADER_BYTES + CTAS_DIR_ENTRY_BYTES * k;
    dir.push({
      type: view.getUint32(at, true),
      id: view.getUint32(at + 4, true),
      offset: view.getUint32(at + 8, true),
      length: view.getUint32(at + 12, true),
    });
  }
  return dir;
};

const readCtas = (data: Uint8Array): CtasEntry[] =>
  readDirectory(data).map((e) => ({ type: e.type, id: e.id, blob: data.slice(e.offset, e.offset + e.length) }));

const ctasVersion = (data: Uint8Array): number =>
  new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(4, true);

export { ctasVersion, isCtas, readCtas, readDirectory };
