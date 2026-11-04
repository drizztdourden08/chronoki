/* @layer shared-asset-extraction @kind logic */
import { decodeString } from './text-tokens';

const readStringList = (rom: Uint8Array, ptrStart: number, count: number, subs: string[]): string[] => {
  const seg = ptrStart & 0xff0000;
  const out: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const ptr = rom[ptrStart + i * 2]! | (rom[ptrStart + i * 2 + 1]! << 8);
    out.push(decodeString(rom, seg + ptr, subs));
  }
  return out;
};

export { readStringList };
