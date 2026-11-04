/* @layer shared-asset-extraction @kind logic */
import { byteAt } from '../bytes/byte-reader';
import { FF } from './menu-lib.constants';

const windowProgram = (rom: Uint8Array, start: number): number => {
  let a = start;
  while ((byteAt(rom, a) & 0x80) === 0) a += 1 + byteAt(rom, FF + 0xbd18 + byteAt(rom, a)) + 1;
  return a + 1;
};

export { windowProgram };
