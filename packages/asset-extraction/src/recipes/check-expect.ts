/* @layer shared-asset-extraction @kind logic */
import type { RecipeExpect } from './recipe.type';
import { wramOf } from './wram-of';

const hex = (v: number, digits: number): string => v.toString(16).toUpperCase().padStart(digits, '0');

const checkExpect = (expect: RecipeExpect, state: Uint8Array): string[] => {
  const w = wramOf(state);
  const bad: string[] = [];
  if (expect.loc !== undefined) {
    const loc = ((w[0x100] as number) | ((w[0x101] as number) << 8)) & 0x1ff;
    if (loc !== expect.loc) bad.push(`loc ${hex(loc, 3)}, expected 0x${hex(expect.loc, 3)}`);
  }
  for (const { addr, value } of expect.wram) {
    if (w[addr] !== value) bad.push(`$${hex(addr, 4)} = ${hex(w[addr] as number, 2)}, expected ${hex(value, 2)}`);
  }
  return bad;
};

export { checkExpect };
