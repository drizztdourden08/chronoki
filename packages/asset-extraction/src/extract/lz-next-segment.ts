/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import { at } from './rom-at';
import type { LzState } from './lz-decompress.type';

const nextSegment = (st: LzState): boolean => {
  const cur = at(st.data, st.bytePos) & 0x3f;
  if (cur === 0) return true;
  st.bitsCount = cur;
  st.byteAfter = st.start + ((at(st.data, st.bytePos + 2) << 8) | at(st.data, st.bytePos + 1));
  st.bytePos += 3;
  return false;
};

export { nextSegment };
