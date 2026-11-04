/* @layer shared-asset-extraction @kind logic */
import type { RecipeExpect } from './recipe.type';

const WRAM_BYTES = 0x20000;
const WRAM_AT_IN_PAYLOAD = 69;
const CTLS_WRAP_BYTES = 16;

const hex = (v: number, digits: number): string => v.toString(16).toUpperCase().padStart(digits, '0');

/** recipes.py wram_of(): the 128 KB of WRAM in a LakeSnes state (a 'CTLS' wrap of 16 bytes, then the payload). */
const wramOf = (state: Uint8Array): Uint8Array => {
  const wrapped = state[0] === 0x43 && state[1] === 0x54 && state[2] === 0x4c && state[3] === 0x53;
  const payload = wrapped ? state.subarray(CTLS_WRAP_BYTES) : state;
  return payload.subarray(WRAM_AT_IN_PAYLOAD, WRAM_AT_IN_PAYLOAD + WRAM_BYTES);
};

/** recipes.py check_expect(): the ways a state differs from what its recipe expects (none = good). */
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

export { checkExpect, wramOf };
