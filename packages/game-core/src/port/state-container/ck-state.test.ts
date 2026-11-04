/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { decodeCkState } from './decode-ck-state';
import { encodeCkState } from './encode-ck-state';

describe('CKST container', { tags: ['critical'] }, () => {
  it('round-trips scene, apu and options', () => {
    const parts = {
      scene: new Uint8Array([1, 2, 3, 4]),
      apu: new Uint8Array([9, 8]),
      options: new Uint8Array([]),
    };
    expect(decodeCkState(encodeCkState(parts))).toEqual(parts);
  });

  it('rejects a wrong magic and a truncated blob', () => {
    const blob = encodeCkState({ scene: new Uint8Array([1]), apu: new Uint8Array([2]), options: new Uint8Array([3]) });
    const wrong = blob.slice();
    wrong[0] = 0;
    expect(decodeCkState(wrong)).toBeNull();
    expect(decodeCkState(blob.subarray(0, blob.length - 1))).toBeNull();
  });
});
