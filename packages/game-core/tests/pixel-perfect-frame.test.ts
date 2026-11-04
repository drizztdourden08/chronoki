/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATE_OPTIONS, FEATURE_REGISTRY, resolveGates } from '@chronoki/features';
import { coverFrame, fillBox, gateSettings, presentBoxOf, presentSizeOf } from '../src';

const WIDE = { minWidth: 256, maxWidth: 544, minHeight: 224, maxHeight: 224 };
const TALL = { minWidth: 256, maxWidth: 256, minHeight: 224, maxHeight: 480 };
const area = (width: number, height: number) => ({ width, height });
const ALL = FEATURE_REGISTRY.map((f) => f.id);
const settingsFor = (requested: string[], options: Partial<typeof DEFAULT_GATE_OPTIONS>) => {
  const { effective } = resolveGates(requested, { vanillaSafe: false, satisfied: new Set(['steamData']) });
  return gateSettings(effective, { ...DEFAULT_GATE_OPTIONS, ...options }, { volume: 100, mute: false });
};

describe('fill box', { tags: ['critical'] }, () => {
  it('fills the whole stage when the ratio nearly matches it', () => {
    expect(fillBox(16 / 9, area(1920, 1080))).toEqual(area(1920, 1080));
    expect(fillBox(16 / 9, area(1904, 1064))).toEqual(area(1904, 1064));
  });

  it('keeps a deliberately different ratio inside the stage', () => {
    expect(fillBox(2, area(1920, 1200))).toEqual(area(1920, 960));
    expect(fillBox(3 / 4, area(1920, 1080))).toEqual(area(810, 1080));
  });
});

describe('pixel perfect frame planning', { tags: ['critical'] }, () => {
  it('renders 384x224 at x5 for 16:9 on 1920x1080, cropping 4 lines top and bottom', () => {
    expect(coverFrame(area(1920, 1080), 16 / 9, WIDE, true)).toEqual({ width: 384, height: 224, scale: 5 });
  });

  it('renders 512x224 at x5 for the screen ratio on 2560x1080', () => {
    expect(coverFrame(area(2560, 1080), 2560 / 1080, WIDE, true)).toEqual({ width: 512, height: 224, scale: 5 });
  });

  it('takes the smallest whole scale that covers, never a smaller one with bars', () => {
    expect(coverFrame(area(2560, 1440), 16 / 9, WIDE, true)).toEqual({ width: 366, height: 224, scale: 7 });
    expect(coverFrame(area(1904, 1024), 16 / 9, WIDE, true)).toEqual({ width: 382, height: 224, scale: 5 });
  });

  it('covers a 21:9 box on a 16:9 screen at x4 with a 480 wide frame', () => {
    expect(coverFrame(area(1920, 1080), 21 / 9, WIDE, true)).toEqual({ width: 480, height: 224, scale: 4 });
  });

  it('plans a tall 3:4 frame on 810x1080 as 256x270 at x4', () => {
    expect(coverFrame(area(810, 1080), 3 / 4, TALL, true)).toEqual({ width: 256, height: 270, scale: 4 });
    expect(coverFrame(area(1920, 1080), 3 / 4, TALL, true)).toEqual({ width: 256, height: 270, scale: 4 });
  });
});

describe('free scale frame planning', { tags: ['critical'] }, () => {
  it('takes the width from the stage ratio for 16:9 on 1920x1080', () => {
    const frame = coverFrame(area(1920, 1080), 16 / 9, WIDE, false);
    expect(frame).toMatchObject({ width: 398, height: 224 });
    expect(frame.scale).toBeCloseTo(1920 / 398, 6);
  });

  it('takes the lines from the stage ratio for 3:4 on 810x1080', () => {
    const frame = coverFrame(area(810, 1080), 3 / 4, TALL, false);
    expect(frame).toMatchObject({ width: 256, height: 340 });
    expect(frame.scale).toBeCloseTo(1080 / 340, 6);
  });
});

describe('gate settings frame', { tags: ['critical'] }, () => {
  it('feeds the planned width to the core when the stage is given', () => {
    expect(settingsFor(ALL, { stageArea: area(1920, 1080), wholePixels: true }).wideWidth).toBe(384);
    expect(settingsFor(ALL, { stageArea: area(1920, 1080) }).wideWidth).toBe(398);
    expect(settingsFor(ALL, { aspectRatio: 'original', stageArea: area(1920, 1080), wholePixels: true }).wideWidth).toBe(0);
  });

  it('renders at scale 1 when the render scale gate is off', () => {
    expect(settingsFor(ALL.filter((id) => id !== 'renderScale'), { renderScale: 4 }).renderScale).toBe(1);
    expect(settingsFor(ALL, { renderScale: 4 }).renderScale).toBe(4);
  });
});

describe('canvas size without pixel perfect', { tags: ['critical'] }, () => {
  it('covers a 1920x1080 stage with 16:9, cropping under a pixel', () => {
    expect(presentSizeOf(area(1920, 1080), area(398, 224), 16 / 9, 'fit')).toEqual(area(1920, 1081));
  });

  it('covers its own box for a deliberate 21:9 and keeps Original contained', () => {
    expect(presentBoxOf(area(1920, 1080), area(522, 224), 21 / 9, 'fit')).toEqual(area(1920, 823));
    expect(presentSizeOf(area(1920, 1080), area(522, 224), 21 / 9, 'fit')).toEqual(area(1920, 824));
    expect(presentSizeOf(area(1920, 1080), area(256, 224), 0, 'fit')).toEqual(area(1234, 1080));
  });

  it('covers the stage even when the frame shape no longer matches it', () => {
    expect(presentSizeOf(area(1920, 1080), area(384, 224), 16 / 9, 'fit')).toEqual(area(1920, 1120));
  });

  it('covers a tall 3:4 stage of 810x1080', () => {
    expect(presentSizeOf(area(810, 1080), area(256, 340), 3 / 4, 'fit')).toEqual(area(814, 1080));
  });
});

describe('canvas size with pixel perfect', { tags: ['critical'] }, () => {
  it('scales a planned frame by the smallest whole factor that covers the stage', () => {
    expect(presentSizeOf(area(1920, 1080), area(384, 224), 16 / 9, 'whole')).toEqual(area(1920, 1120));
    expect(presentSizeOf(area(2560, 1080), area(512, 224), 2560 / 1080, 'whole')).toEqual(area(2560, 1120));
    expect(presentSizeOf(area(1920, 1080), area(480, 224), 21 / 9, 'whole')).toEqual(area(1920, 896));
    expect(presentSizeOf(area(810, 1080), area(256, 270), 3 / 4, 'whole')).toEqual(area(1024, 1080));
  });

  it('still covers with a frame planned for an older stage, never x4 with bars', () => {
    expect(presentSizeOf(area(1920, 1080), area(456, 224), 16 / 9, 'whole')).toEqual(area(2280, 1120));
  });

  it('keeps Original whole and inside the stage', () => {
    expect(presentSizeOf(area(1920, 1080), area(256, 224), 0, 'whole')).toEqual(area(1024, 896));
    expect(presentBoxOf(area(1920, 1080), area(256, 224), 0, 'whole')).toEqual(area(1024, 896));
  });
});
