/* @layer bridge-wasm @kind logic */
import { encodeClearBits } from './encode-clear-bits';
import type { EncodeResult } from './script-splice.type';

const tryEncodeClearBits = (at: number, bits: number): EncodeResult => {
  try {
    return { ok: true, bytes: encodeClearBits(at, bits) };
  } catch (error) {
    return { ok: false, failed: [error instanceof Error ? error.message : 'bad clear-bits spec'] };
  }
};

export { tryEncodeClearBits };
