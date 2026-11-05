/* @layer bridge-wasm @kind fixture */
import { RECORD_BYTES } from './level-record.constants';

const synthRecord = (id: number): number[] => {
  const r = new Array<number>(RECORD_BYTES).fill(0);
  r[0] = id;
  r[1] = id + 1;
  r[0x05] = 100;
  r[0x09] = 10;
  r[0x12] = 1 + id * 3;
  r[0x13] = id + 20;
  r[0x27] = 0x70 + id;
  r[0x2b] = id + 40;
  for (const base of [0x2f, 0x30, 0x32, 0x33, 0x34, 0x35]) r[base] = 5 + id;
  return r;
};

export { synthRecord };
