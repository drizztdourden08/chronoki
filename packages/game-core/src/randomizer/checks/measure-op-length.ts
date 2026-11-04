/* @layer bridge-wasm @kind logic */
import { OP_LENGTHS } from './gift-ops.constants';

const at = (b: Uint8Array, o: number): number => b[o] ?? 0;
const word = (b: Uint8Array, o: number): number => at(b, o) | (at(b, o + 1) << 8);

const paletteLength = (cmd: number, b: Uint8Array, o: number): number => {
  if (cmd === 0x20 || cmd === 0x30) return 4;
  if (cmd >= 0x40 && cmd < 0x60) return 5;
  return cmd >= 0x80 && cmd < 0x90 ? 2 + word(b, o + 2) : 2;
};

const blockLength = (cmd: number, b: Uint8Array, o: number): number => {
  if (cmd & 0x40) return 6;
  return cmd & 0x80 ? 3 + word(b, o + 3) : 2;
};

const measureOpLength = (b: Uint8Array, o: number): number => {
  const op = at(b, o);
  const cmd = at(b, o + 1);
  if (op === 0x4e) return 4 + word(b, o + 4);
  if (op === 0x2e) return blockLength(cmd, b, o);
  if (op === 0x88) return cmd === 0 ? 2 : paletteLength(cmd, b, o);
  if (op === 0xf1) return cmd === 0 ? 2 : 3;
  if (op === 0xff) return cmd === 0x90 || cmd === 0x97 ? 5 : 2;
  if (op === 0xcd || op === 0xce) return 3;
  if (op === 0xcc) return 4;
  return OP_LENGTHS[op] ?? 0;
};

export { measureOpLength };
