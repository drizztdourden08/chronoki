/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import { at } from './rom-at';
import type { LzState } from './lz-decompress.type';
import { ensure } from './lz-ensure';

const rawBlock = (st: LzState): void => {
  ensure(st, st.workPos + 8);
  for (let i = 1; i < 9; i += 1) {
    st.out[st.workPos] = at(st.data, st.bytePos + i);
    st.workPos += 1;
  }
  st.bytePos += 9;
};

export { rawBlock };
