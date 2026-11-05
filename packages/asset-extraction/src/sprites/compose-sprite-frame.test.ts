/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { composeSpriteFrame } from './compose-sprite-frame';
import type { ComposedFrame } from './party-sprites.type';
import { SPR_OX, SPR_OY, SPR_W } from './party-sprites.constants';

const buildBlob = (chips: number[], offs: [number, number][]): Uint8Array => {
  const ntiles = 2;
  const blob = new Uint8Array(4 + 48 + ntiles * 64 + 4 * 10);
  blob[0] = 0;
  blob[1] = 1;
  blob[2] = ntiles;
  for (let i = 0; i < 16; i += 1) blob[4 + i * 3] = i * 3;
  const tile1 = 4 + 48 + 64;
  blob[tile1] = 5;
  blob[tile1 + 7] = 7;
  const frame = 4 + 48 + ntiles * 64;
  chips.forEach((c, k) => {
    blob[frame + k * 2] = c & 0xff;
    blob[frame + k * 2 + 1] = c >> 8;
  });
  offs.forEach(([x, y], u) => {
    blob[frame + 32 + u * 2] = x & 0xff;
    blob[frame + 32 + u * 2 + 1] = y & 0xff;
  });
  return blob;
};

const empty = new Array<number>(16).fill(0);
const noOffs: [number, number][] = [[0, 0], [0, 0], [0, 0], [0, 0]];
const at = (indices: Uint8Array, x: number, y: number): number => indices[(y + SPR_OY) * SPR_W + x + SPR_OX] ?? 0;
const composed = (blob: Uint8Array): ComposedFrame => composeSpriteFrame(blob, 0) ?? { indices: new Uint8Array(0), palette: new Uint8Array(0), box: [0, 0, 0, 0] };

describe('composeSpriteFrame follows CtComposeSprite', { tags: ['critical'] }, () => {
  it('places quadrants and treats index 0 as transparent', () => {
    const chips = [...empty];
    chips[0] = 1;
    chips[3] = 1;
    const out = composed(buildBlob(chips, noOffs));
    expect(at(out.indices, 0, 0)).toBe(5);
    expect(at(out.indices, 7, 0)).toBe(7);
    expect(at(out.indices, 8, 8)).toBe(5);
    expect(at(out.indices, 1, 0)).toBe(0);
  });

  it('flips x and y', () => {
    const chips = [...empty];
    chips[0] = 1 | 0x4000;
    chips[2] = 1 | 0x8000;
    const out = composed(buildBlob(chips, noOffs));
    expect(at(out.indices, 7, 0)).toBe(5);
    expect(at(out.indices, 0, 0)).toBe(7);
    expect(at(out.indices, 0, 15)).toBe(5);
  });

  it('applies signed offsets and reports the ink box', () => {
    const chips = [...empty];
    chips[0] = 1;
    const out = composed(buildBlob(chips, [[-4, -10], [0, 0], [0, 0], [0, 0]]));
    expect(at(out.indices, -4, -10)).toBe(5);
    expect(out.box).toEqual([SPR_OX - 4, SPR_OY - 10, SPR_OX + 3, SPR_OY - 10]);
  });

  it('keeps the first drawn pixel and rejects a bad frame', () => {
    const chips = [...empty];
    chips[0] = 1;
    chips[1] = 1 | 0x4000;
    const blob = buildBlob(chips, [[0, 0], [0, 0], [0, 0], [0, 0]]);
    expect(at(composed(blob).indices, 8, 0)).toBe(7);
    expect(composeSpriteFrame(blob, 1)).toBeNull();
    expect(composeSpriteFrame(blob.slice(0, 20), 0)).toBeNull();
  });
});
