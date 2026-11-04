/* @layer shared-asset-extraction @kind logic */
import { paeth } from './paeth';

const unfilterByte = (filter: number, l: number, { a, b, c }: { a: number; b: number; c: number }): number => {
  if (filter === 1) return (l + a) & 255;
  if (filter === 2) return (l + b) & 255;
  if (filter === 3) return (l + ((a + b) >> 1)) & 255;
  if (filter === 4) return (l + paeth(a, b, c)) & 255;
  return l;
};

export { unfilterByte };
