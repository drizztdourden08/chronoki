/* @layer bridge-wasm @kind logic */
import type { CkStateSection, SectionedState } from './sectioned-state.type';
import {
  CKST_LENGTH_BYTES, CKST_MAGIC, CKST_TAG_BYTES, CKST_SECTIONED_HEADER_BYTES, CKST_SECTION_HEADER_BYTES, CKST_VERSION, TAG_STAMP,
} from './ck-state.constants';
import { readCkStamp } from './read-ck-stamp';

const readSections = (bytes: Uint8Array, view: DataView, count: number): CkStateSection[] | null => {
  const decoder = new TextDecoder();
  const sections: CkStateSection[] = [];
  let at = CKST_SECTIONED_HEADER_BYTES;
  for (let i = 0; i < count; i += 1) {
    if (at + CKST_SECTION_HEADER_BYTES > bytes.length) return null;
    const length = view.getUint32(at + CKST_TAG_BYTES * 2, true);
    const start = at + CKST_SECTION_HEADER_BYTES;
    if (length > bytes.length - start) return null;
    sections.push({
      tag: decoder.decode(bytes.subarray(at, at + CKST_TAG_BYTES)),
      version: view.getUint32(at + CKST_TAG_BYTES, true),
      bytes: bytes.slice(start, start + length),
    });
    at = start + length;
  }
  return sections;
};

const decodeSectionedState = (bytes: Uint8Array): SectionedState | null => {
  if (bytes.length < CKST_SECTIONED_HEADER_BYTES) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const magic = new TextDecoder().decode(bytes.subarray(0, CKST_LENGTH_BYTES));
  if (magic !== CKST_MAGIC || view.getUint32(CKST_LENGTH_BYTES, true) !== CKST_VERSION) return null;
  const sections = readSections(bytes, view, view.getUint32(CKST_LENGTH_BYTES * 2, true));
  const stampSection = sections?.find((s) => s.tag === TAG_STAMP);
  const stamp = stampSection ? readCkStamp(new TextDecoder().decode(stampSection.bytes)) : null;
  return sections && stamp ? { stamp, sections } : null;
};

export { decodeSectionedState };
