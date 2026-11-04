/* @layer shared-asset-extraction @kind logic */
import { CTAS_DIR_ENTRY_BYTES, CTAS_HEADER_BYTES } from './ctas.constants';
import type { CtasDirEntry } from './ctas.type';
import { isCtas } from './is-ctas';

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

export { readDirectory };
