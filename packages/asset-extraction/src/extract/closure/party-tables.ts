/* @layer shared-asset-extraction @kind logic */
import type { RomTable } from './closure.type';
import { maxOf } from './max-of';

const partyTables = (rom: Uint8Array): RomTable[] => {
  const cd6cec = 0x0d6cec;
  return [
    ['walk-anim jump table ($C0:9FF7, X & 7E)', 0x009ff7, 0x009ff7 + 0x80],
    ['walk-anim handlers ($C0:A079-A171, their operands)', 0x00a079, 0x00a171],
    ['triple-tech members ($CC:2953, 5 x 3)', 0x0c2953, 0x0c2953 + 15],
    ['triple-tech masks ($CC:2983, 5)', 0x0c2983, 0x0c2983 + 5],
    ['PC bit table ($FF:F9BB, 8-bit index)', 0x3ff9bb, 0x3ff9bb + 0x100],
    ['weapon palette index ($CD:6CEC, 8-bit index)', cd6cec, cd6cec + 0x100],
    ['weapon palettes ($D1:4B00, 6 each)', 0x114b00, 0x114b00 + 6 * (maxOf(rom.subarray(cd6cec, cd6cec + 0x100)) + 1)],
  ];
};

export { partyTables };
