/* @layer bridge-wasm @kind logic */
import type { CkStateParts } from './ck-state.type';
import { CKST_HEADER_BYTES, CKST_LENGTH_BYTES, CKST_MAGIC, CKST_VERSION } from './ck-state.constants';

const encodeCkState = (parts: CkStateParts): Uint8Array => {
  const sections = [parts.scene, parts.apu, parts.options];
  const total = CKST_HEADER_BYTES + sections.reduce((sum, s) => sum + CKST_LENGTH_BYTES + s.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  out.set(new TextEncoder().encode(CKST_MAGIC), 0);
  view.setUint32(CKST_LENGTH_BYTES, CKST_VERSION, true);
  let at = CKST_HEADER_BYTES;
  for (const section of sections) {
    view.setUint32(at, section.length, true);
    out.set(section, at + CKST_LENGTH_BYTES);
    at += CKST_LENGTH_BYTES + section.length;
  }
  return out;
};

export { encodeCkState };
