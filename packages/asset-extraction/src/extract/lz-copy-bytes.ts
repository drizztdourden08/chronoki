/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import { at } from './rom-at';
import type { LzState } from './lz-decompress.type';

const copyBytes = (st: LzState): void => {
  const { data, small } = st;
  let count = at(data, st.bytePos + 1);
  count >>= small ? 3 : 4;
  count += 2;
  let off = (at(data, st.bytePos + 1) << 8) | at(data, st.bytePos);
  off &= small ? 0x07ff : 0x0fff;
  for (let i = 0; i < count + 1; i += 1) {
    const from = st.workPos - off + i;
    st.out[st.workPos + i] = from < 0 ? (st.out[st.out.length + from] as number) : (st.out[from] as number);
  }
  st.workPos += count + 1;
  st.bytePos += 2;
};

export { copyBytes };
