/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { frameSizeOf, letterboxBox, parseRatio, ratioToWidth } from '../src';

describe('ratio to picture width', { tags: ['critical'] }, () => {
  it('gives 298, 358, 398 and 522 for 4:3, 16:10, 16:9 and 21:9', () => {
    expect(['4:3', '16:10', '16:9', '21:9'].map((r) => ratioToWidth(parseRatio(r)))).toEqual([298, 358, 398, 522]);
  });
});

describe('custom ratio cap', { tags: ['critical'] }, () => {
  it('caps a 3:1 ratio at 544', () => {
    expect(ratioToWidth(parseRatio('3:1'))).toBe(544);
  });
});

describe('tall ratio letterbox', { tags: ['critical'] }, () => {
  it('keeps the 3:4 frame at 256x224 and presents a 256x341 box', () => {
    const settings = { widescreen: 'off', wideWidth: 0, renderScale: 1, interpolation: false } as const;
    expect(frameSizeOf(settings)).toEqual({ width: 256, height: 224 });
    expect(letterboxBox(parseRatio('3:4'))).toEqual({ width: 256, height: 341 });
  });
});

describe('configured wide width', { tags: ['critical'] }, () => {
  it('makes the frame as wide as the configured width at 224 lines', () => {
    const settings = { widescreen: '16:9', wideWidth: 298, renderScale: 1, interpolation: false } as const;
    expect(frameSizeOf(settings)).toEqual({ width: 298, height: 224 });
  });
});
