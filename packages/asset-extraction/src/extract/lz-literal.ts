/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import { at } from './rom-at';
import type { LzState } from './lz-decompress.type';

const literal = (st: LzState): void => {
  st.out[st.workPos] = at(st.data, st.bytePos);
  st.workPos += 1;
  st.bytePos += 1;
};

export { literal };
