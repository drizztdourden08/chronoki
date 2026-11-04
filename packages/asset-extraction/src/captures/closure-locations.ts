/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/u16';

const ptr24 = (rom: Uint8Array, at: number): number | null => {
  const bank = rom[at + 2] as number;
  return bank < 0xc0 ? null : ((bank - 0xc0) << 16) | u16(rom, at);
};

export { ptr24 };
