/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import type { LzState } from './lz-decompress.type';

const ensure = (st: LzState, n: number): void => {
  if (n >= st.out.length) {
    const grown = new Uint8Array(n + (1 << 16));
    grown.set(st.out);
    st.out = grown;
  }
};

export { ensure };
