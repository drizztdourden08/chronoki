/* @layer tests @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCtasBuilder } from '../ctas/ctas-builder';
import { T_PORTRAIT, T_SPRITE, T_SPRITEANIM } from '../extract/asset-types.constants';
import { partySpriteBuffers } from './party-sprite-buffers';

const spriteBlob = (): Uint8Array => {
  const blob = new Uint8Array(4 + 48 + 64 + 40);
  blob[1] = 1;
  blob[2] = 1;
  blob[4 + 48] = 3;
  blob[4 + 48 + 64] = 0;
  return blob;
};

const fakePack = (skip?: { type: number; id: number }): Uint8Array => {
  const builder = createCtasBuilder();
  for (let id = 0; id < 7; id += 1) {
    const parts: [number, Uint8Array][] = [
      [T_PORTRAIT, Uint8Array.from([1, 1, 9, 9, 9])],
      [T_SPRITE, spriteBlob()],
      [T_SPRITEANIM, Uint8Array.from([1, 1, 0, 0, 0, 0, 4])],
    ];
    for (const [type, blob] of parts) if (!skip || skip.type !== type || skip.id !== id) builder.add(type, id, blob);
  }
  return builder.build();
};

const stubCanvas = (): void => {
  vi.stubGlobal('OffscreenCanvas', class {
    getContext = () => ({ putImageData: () => undefined });
    convertToBlob = async () => new Blob([Uint8Array.from([137, 80, 78, 71])]);
  });
  vi.stubGlobal('ImageData', class {
    constructor(public data: Uint8ClampedArray, public width: number, public height: number) {}
  });
};

afterEach(() => vi.unstubAllGlobals());

describe('partySpriteBuffers', { tags: ['critical'] }, () => {
  it('returns 14 named buffers for a complete pack', async () => {
    stubCanvas();
    const out = await partySpriteBuffers(fakePack());
    expect(out).toHaveLength(14);
    expect(out.map((b) => b.name)).toContain('party/portrait-6.png');
    expect(out.map((b) => b.name)).toContain('party/stand-0.png');
    expect(out.every((b) => b.bytes.length === 4)).toBe(true);
  });

  it('throws when a pack entry is missing', async () => {
    stubCanvas();
    await expect(partySpriteBuffers(fakePack({ type: T_SPRITE, id: 3 }))).rejects.toThrow(/missing/);
  });
});
