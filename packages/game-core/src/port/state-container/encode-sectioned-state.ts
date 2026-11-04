/* @layer bridge-wasm @kind logic */
import type { CkStateSection } from './sectioned-state.type';
import {
  CKST_LENGTH_BYTES, CKST_MAGIC, CKST_TAG_BYTES, CKST_SECTIONED_HEADER_BYTES, CKST_SECTION_HEADER_BYTES, CKST_VERSION,
} from './ck-state.constants';

const encodeSectionedState = (sections: CkStateSection[]): Uint8Array => {
  const total = CKST_SECTIONED_HEADER_BYTES + sections.reduce((sum, s) => sum + CKST_SECTION_HEADER_BYTES + s.bytes.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  const encoder = new TextEncoder();
  out.set(encoder.encode(CKST_MAGIC), 0);
  view.setUint32(CKST_LENGTH_BYTES, CKST_VERSION, true);
  view.setUint32(CKST_LENGTH_BYTES * 2, sections.length, true);
  let at = CKST_SECTIONED_HEADER_BYTES;
  for (const section of sections) {
    out.set(encoder.encode(section.tag), at);
    view.setUint32(at + CKST_TAG_BYTES, section.version, true);
    view.setUint32(at + CKST_TAG_BYTES * 2, section.bytes.length, true);
    out.set(section.bytes, at + CKST_SECTION_HEADER_BYTES);
    at += CKST_SECTION_HEADER_BYTES + section.bytes.length;
  }
  return out;
};

export { encodeSectionedState };
