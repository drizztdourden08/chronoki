/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { encodeChangeLocation } from './encode-change-location';
import { retargetChangeLocation } from './retarget-change-location';

describe('retargetChangeLocation', () => {
  it('keeps the opcode and the flag bits of an E0 op carrying 0x80', { tags: ['critical'] }, () => {
    const anchor = Uint8Array.of(0xe0, 0xf0, 0x81, 0x3f, 0x38);
    expect([...retargetChangeLocation(anchor, 0x0a2, 5, 6)]).toEqual([0xe0, 0xa2, 0x80, 5, 6]);
    expect([...retargetChangeLocation(anchor, 0x1a2, 5, 6)]).toEqual([0xe0, 0xa2, 0x81, 5, 6]);
  });

  it('keeps the facing bits 1-4 and another opcode', { tags: ['critical'] }, () => {
    const anchor = Uint8Array.of(0xdf, 0xf0, 0x9f, 0x00, 0x00);
    expect([...retargetChangeLocation(anchor, 0x0a2, 1, 2)]).toEqual([0xdf, 0xa2, 0x9e, 1, 2]);
  });

  it('encodeChangeLocation takes the same flags explicitly', { tags: ['critical'] }, () => {
    expect([...encodeChangeLocation(0x1f1, 5, 6)]).toEqual([0xe0, 0xf1, 0x01, 5, 6]);
    expect([...encodeChangeLocation(0x1f1, 5, 6, { op: 0xe0, flags: 0x80 })]).toEqual([0xe0, 0xf1, 0x81, 5, 6]);
  });
});
