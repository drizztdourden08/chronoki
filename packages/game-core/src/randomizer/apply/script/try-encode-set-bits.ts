/* @layer bridge-wasm @kind logic */
import { encodeSetBits } from './encode-set-bits';
import type { EncodeResult } from './script-splice.type';

const tryEncodeSetBits = (at: number, bits: number): EncodeResult => {
  try {
    return { ok: true, bytes: encodeSetBits(at, bits) };
  } catch (error) {
    return { ok: false, failed: [error instanceof Error ? error.message : 'bad set-bits spec'] };
  }
};

export { tryEncodeSetBits };
