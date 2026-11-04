/* @layer bridge-wasm @kind logic */
import { SRAM_SLOT_SPAN } from './save-file.constants';
import { wordAt } from './word-at';

const slotChecksum = (bytes: Uint8Array, base: number): number => {
  let sum = 0;
  let carry = 0;
  for (let at = SRAM_SLOT_SPAN - 2; at >= 0; at -= 2) {
    const total = sum + wordAt(bytes, base + at) + carry;
    carry = total > 0xffff ? 1 : 0;
    sum = total & 0xffff;
  }
  return sum;
};

export { slotChecksum };
