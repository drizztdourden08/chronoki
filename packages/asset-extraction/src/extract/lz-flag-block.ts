/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import type { LzState } from './lz-decompress.type';
import { step } from './lz-step';

const flagBlock = (st: LzState, cur: number): void => {
  st.bytePos += 1;
  let mem = cur >> 1;
  step(st, cur & 1);
  for (;;) {
    st.bitsCount -= 1;
    if (st.bitsCount === 0) {
      st.bitsCount = 8;
      return;
    }
    const c = mem & 1;
    mem >>= 1;
    step(st, c);
  }
};

export { flagBlock };
