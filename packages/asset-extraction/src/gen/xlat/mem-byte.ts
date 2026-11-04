/* @layer shared-asset-extraction @kind logic */
import type { XlatInput } from './xlat-site.type';

const memByte = (input: XlatInput, image: string, adr: number): number | undefined => {
  const k = adr >> 16;
  const p = adr & 0xffff;
  const wram = input.images.get(image) as Uint8Array;
  if (k === 0x7e || k === 0x7f) return wram[((k & 1) << 16) | p];
  if ((k < 0x40 || (k >= 0x80 && k < 0xc0)) && p < 0x2000) return wram[p];
  if (p >= 0x8000 || (k & 0x7f) >= 0x40) return input.rom[(((k & 0x3f) << 16) | p) % input.rom.length];
  return undefined;
};

export { memByte };
