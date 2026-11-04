/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import { at } from './rom-at';
import type { LzState } from './lz-decompress.type';

const ensure = (st: LzState, n: number): void => {
  if (n >= st.out.length) {
    const grown = new Uint8Array(n + (1 << 16));
    grown.set(st.out);
    st.out = grown;
  }
};

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

const literal = (st: LzState): void => {
  st.out[st.workPos] = at(st.data, st.bytePos);
  st.workPos += 1;
  st.bytePos += 1;
};

const step = (st: LzState, isCopy: number): void => {
  ensure(st, st.workPos + 4096);
  if (isCopy) copyBytes(st);
  else literal(st);
};

const rawBlock = (st: LzState): void => {
  ensure(st, st.workPos + 8);
  for (let i = 1; i < 9; i += 1) {
    st.out[st.workPos] = at(st.data, st.bytePos + i);
    st.workPos += 1;
  }
  st.bytePos += 9;
};

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

const nextSegment = (st: LzState): boolean => {
  const cur = at(st.data, st.bytePos) & 0x3f;
  if (cur === 0) return true;
  st.bitsCount = cur;
  st.byteAfter = st.start + ((at(st.data, st.bytePos + 2) << 8) | at(st.data, st.bytePos + 1));
  st.bytePos += 3;
  return false;
};

export { rawBlock, flagBlock, nextSegment };
