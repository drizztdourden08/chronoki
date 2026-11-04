/* @layer bridge-wasm @kind logic */
import type { CkStateParts } from './ck-state.type';
import { CKST_HEADER_BYTES, CKST_LENGTH_BYTES, CKST_MAGIC, CKST_SECTION_COUNT, CKST_LEGACY_VERSION } from './ck-state.constants';

const decodeCkState = (bytes: Uint8Array): CkStateParts | null => {
  if (bytes.length < CKST_HEADER_BYTES) return null;
  const magic = new TextDecoder().decode(bytes.subarray(0, CKST_LENGTH_BYTES));
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (magic !== CKST_MAGIC || view.getUint32(CKST_LENGTH_BYTES, true) !== CKST_LEGACY_VERSION) return null;
  const sections: Uint8Array[] = [];
  let at = CKST_HEADER_BYTES;
  for (let i = 0; i < CKST_SECTION_COUNT; i += 1) {
    if (at + CKST_LENGTH_BYTES > bytes.length) return null;
    const length = view.getUint32(at, true);
    const start = at + CKST_LENGTH_BYTES;
    if (start + length > bytes.length) return null;
    sections.push(bytes.slice(start, start + length));
    at = start + length;
  }
  const [scene, apu, options] = sections;
  return scene && apu && options ? { scene, apu, options } : null;
};

export { decodeCkState };
