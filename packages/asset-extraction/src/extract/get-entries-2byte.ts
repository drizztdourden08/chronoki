/* @layer shared-asset-extraction @kind logic */
import { u16 } from './u16';

const getEntries2Byte = (rom: Uint8Array, tableAddr: number, count: number): number[] => {
  const bankStart = tableAddr & 0xff0000;
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) out.push(bankStart + u16(rom, tableAddr + i * 2));
  return out;
};

export { getEntries2Byte };
