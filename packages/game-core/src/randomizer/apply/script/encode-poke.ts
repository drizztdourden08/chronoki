/* @layer bridge-wasm @kind logic */
import { OP_POKE_BYTE, OP_POKE_WORD } from './script-ops.constants';

const encodePoke = (at: number, value: number, width: 1 | 2): Uint8Array =>
  width === 1
    ? Uint8Array.of(OP_POKE_BYTE, at & 0xff, (at >> 8) & 0xff, (at >> 16) & 0xff, value & 0xff)
    : Uint8Array.of(OP_POKE_WORD, at & 0xff, (at >> 8) & 0xff, (at >> 16) & 0xff, value & 0xff, (value >> 8) & 0xff);

export { encodePoke };
