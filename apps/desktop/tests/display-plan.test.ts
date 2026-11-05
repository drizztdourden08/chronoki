/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { coverFrame, presentSizeOf } from '@chronoki/game-core';

const FREE = { minWidth: 256, maxWidth: 544, minHeight: 224, maxHeight: 480 };
const area = (width: number, height: number) => ({ width, height });

describe('display plan seen by the window', { tags: ['critical'] }, () => {
  it('3:4 pixel perfect fills an 810x1025 stage on both axes at a whole scale', () => {
    const frame = coverFrame(area(810, 1025), 3 / 4, FREE, true);
    expect(frame).toEqual({ width: 270, height: 342, scale: 3 });
    expect(presentSizeOf(area(810, 1025), area(frame.width, frame.height), 3 / 4, 'whole')).toEqual(area(810, 1026));
  });

  it('3:4 pixel perfect fills an 810x990 stage (window minus title bar) instead of 768 wide with bars', () => {
    expect(coverFrame(area(810, 990), 3 / 4, FREE, true)).toEqual({ width: 270, height: 330, scale: 3 });
  });

  it('16:9 without pixel perfect never draws a canvas bigger than 1920x1080', () => {
    for (const width of [396, 398, 400]) {
      const size = presentSizeOf(area(1920, 1080), area(width, 224), 16 / 9, 'fit');
      expect(size.width).toBeLessThanOrEqual(1920);
      expect(size.height).toBeLessThanOrEqual(1080);
    }
    expect(presentSizeOf(area(1920, 1080), area(398, 224), 16 / 9, 'fit')).toEqual(area(1920, 1080));
  });
});
