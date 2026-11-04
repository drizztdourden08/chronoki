/* @layer shared-asset-extraction @kind logic @source Python script.op_len */
import { byteAt } from '../bytes/byte-reader';
import { OPLEN } from './script-oplen.constants';

const opLen2e = (b: Uint8Array, o: number): number => {
  const cm = byteAt(b, o + 1);
  if (cm & 0x40) return 6;
  if (cm & 0x80) return 3 + (byteAt(b, o + 3) | (byteAt(b, o + 4) << 8));
  return 2;
};

const opLen88 = (b: Uint8Array, o: number): number => {
  const cmd = byteAt(b, o + 1);
  if (cmd === 0x00) return 2;
  if (cmd === 0x20 || cmd === 0x30) return 4;
  if (cmd >= 0x40 && cmd < 0x60) return 5;
  if (cmd >= 0x80 && cmd < 0x90) return 2 + (byteAt(b, o + 2) | (byteAt(b, o + 3) << 8));
  return 2;
};

const opLen = (b: Uint8Array, o: number): number => {
  const op = byteAt(b, o);
  if (op === 0x4e) return 4 + (byteAt(b, o + 4) | (byteAt(b, o + 5) << 8));
  if (op === 0x2e) return opLen2e(b, o);
  if (op === 0x88) return opLen88(b, o);
  if (op === 0xf1) return byteAt(b, o + 1) === 0 ? 2 : 3;
  if (op === 0xff) return [0x90, 0x97].includes(byteAt(b, o + 1)) ? 5 : 2;
  return OPLEN.get(op) ?? 1;
};

export { opLen };
