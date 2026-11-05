/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATE_OPTIONS, FEATURE_REGISTRY, resolveGates } from '@chronoki/features';
import { coverFrame, fillBox, gateSettings, pictureRatioOf, presentBoxOf, presentSizeOf } from '../src';

const WIDE = { minWidth: 256, maxWidth: 544, minHeight: 224, maxHeight: 224 };
const TALL = { minWidth: 256, maxWidth: 256, minHeight: 224, maxHeight: 480 };
const FREE = { minWidth: 256, maxWidth: 544, minHeight: 224, maxHeight: 480 };
const area = (width: number, height: number) => ({ width, height });
const ALL = FEATURE_REGISTRY.map((f) => f.id);
const NO_TALL = ALL.filter((id) => id !== 'tallRendering');
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

describe('pixel perfect frame on both axes', { tags: ['critical'] }, () => {
  it('fills 1920x1080 exactly at x4 with 480x270', () => {
    expect(coverFrame(area(1920, 1080), 16 / 9, FREE, true)).toEqual({ width: 480, height: 270, scale: 4 });
  });

  it('renders 428x240 at x3 on 1280x720 and at x6 on 2560x1440', () => {
    expect(coverFrame(area(1280, 720), 16 / 9, FREE, true)).toEqual({ width: 428, height: 240, scale: 3 });
    expect(coverFrame(area(2560, 1440), 16 / 9, FREE, true)).toEqual({ width: 428, height: 240, scale: 6 });
  });

  it('keeps 256 wide and 224 lines at least: 3:4 on 810x1080 is x3, 270x360', () => {
    expect(coverFrame(area(810, 1080), 3 / 4, FREE, true)).toEqual({ width: 270, height: 360, scale: 3 });
  });

  it('widens a 3:4 frame past 256 on a settled stage, windowed or fullscreen', () => {
    expect(coverFrame(area(810, 1040), 3 / 4, FREE, true)).toEqual({ width: 270, height: 348, scale: 3 });
    expect(coverFrame(area(1920, 1080), 3 / 4, FREE, true)).toEqual({ width: 270, height: 360, scale: 3 });
  });

  it('fills a 3:4 stage of 810x1025 at x3 with 270x342', () => {
    expect(coverFrame(area(810, 1025), 3 / 4, FREE, true)).toEqual({ width: 270, height: 342, scale: 3 });
  });

  it('fills a stage past the snap (810x990) with extra columns when the 256 minimum already overflows the 3:4 box', () => {
    expect(coverFrame(area(810, 990), 3 / 4, FREE, true)).toEqual({ width: 270, height: 330, scale: 3 });
  });

  it('keeps a deliberate 3:4 on a wide stage (1920x990) at 256 wide, not a new scale', () => {
    expect(coverFrame(area(1920, 990), 3 / 4, FREE, true)).toEqual({ width: 256, height: 330, scale: 3 });
  });

  it('raises the scale when the width would pass 544', () => {
    expect(coverFrame(area(2560, 1080), 2560 / 1080, FREE, true)).toEqual({ width: 512, height: 224, scale: 5 });
  });
});

describe('pixel perfect frame on one axis (tall rendering off)', { tags: ['critical'] }, () => {
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
    expect(settingsFor(ALL, { stageArea: area(1920, 1080), wholePixels: true })).toMatchObject({ wideWidth: 480, tallLines: 270 });
    expect(settingsFor(NO_TALL, { stageArea: area(1920, 1080), wholePixels: true })).toMatchObject({ wideWidth: 384, tallLines: 0 });
    expect(settingsFor(ALL, { stageArea: area(1920, 1080) })).toMatchObject({ wideWidth: 398, tallLines: 0 });
    expect(settingsFor(ALL, { aspectRatio: 'original', stageArea: area(1920, 1080), wholePixels: true }).wideWidth).toBe(0);
  });

  it('plans 3:4 on both axes under pixel perfect and on the lines alone without it', () => {
    expect(settingsFor(ALL, { aspectRatio: '3:4', stageArea: area(810, 1080), wholePixels: true })).toMatchObject({ wideWidth: 270, tallLines: 360 });
    expect(settingsFor(ALL, { aspectRatio: '3:4', stageArea: area(810, 1080) })).toMatchObject({ wideWidth: 0, tallLines: 340 });
  });

  it('plans 3:4 pixel perfect on 810x990 as 270x330 and presents it at the stage ratio, filling it at x3', () => {
    const options = { ...DEFAULT_GATE_OPTIONS, aspectRatio: '3:4' as const, stageArea: area(810, 990), wholePixels: true };
    const { effective } = resolveGates(ALL, { vanillaSafe: false, satisfied: new Set(['steamData']) });
    expect(settingsFor(ALL, options)).toMatchObject({ wideWidth: 270, tallLines: 330 });
    const ratio = pictureRatioOf(effective, options);
    expect(ratio).toBeCloseTo(810 / 990, 9);
    expect(presentSizeOf(area(810, 990), area(270, 330), ratio, 'whole')).toEqual(area(810, 990));
    expect(pictureRatioOf(effective, { ...options, stageArea: area(1920, 1080) })).toBe(3 / 4);
  });

  it('plans from the stage it is given: a 1032 high stage before fullscreen gives 258 lines', () => {
    expect(settingsFor(ALL, { aspectRatio: '16:9', stageArea: area(1920, 1032), wholePixels: true })).toMatchObject({ wideWidth: 480, tallLines: 258 });
    expect(settingsFor(ALL, { aspectRatio: '16:9', stageArea: area(1920, 1080), wholePixels: true })).toMatchObject({ wideWidth: 480, tallLines: 270 });
  });

  it('renders at scale 1 when the render scale gate is off', () => {
    expect(settingsFor(ALL.filter((id) => id !== 'renderScale'), { renderScale: 4 }).renderScale).toBe(1);
    expect(settingsFor(ALL, { renderScale: 4 }).renderScale).toBe(4);
  });
});

describe('canvas size without pixel perfect', { tags: ['critical'] }, () => {
  it('fills a 1920x1080 stage with 16:9 and never exceeds it (was 1920x1081)', () => {
    expect(presentSizeOf(area(1920, 1080), area(398, 224), 16 / 9, 'fit')).toEqual(area(1920, 1080));
    expect(presentSizeOf(area(1920, 1080), area(396, 224), 16 / 9, 'fit')).toEqual(area(1920, 1080));
  });

  it('covers its own box for a deliberate 21:9 and keeps Original contained', () => {
    expect(presentBoxOf(area(1920, 1080), area(522, 224), 21 / 9, 'fit')).toEqual(area(1920, 823));
    expect(presentSizeOf(area(1920, 1080), area(522, 224), 21 / 9, 'fit')).toEqual(area(1920, 824));
    expect(presentSizeOf(area(1920, 1080), area(256, 224), 0, 'fit')).toEqual(area(1234, 1080));
  });

  it('stays inside the stage even when the frame shape no longer matches it', () => {
    expect(presentSizeOf(area(1920, 1080), area(384, 224), 16 / 9, 'fit')).toEqual(area(1920, 1080));
  });

  it('fills a tall 3:4 stage of 810x1080 without passing its width', () => {
    expect(presentSizeOf(area(810, 1080), area(256, 340), 3 / 4, 'fit')).toEqual(area(810, 1080));
  });
});

describe('canvas size with pixel perfect', { tags: ['critical'] }, () => {
  it('scales a planned frame by the smallest whole factor that covers the stage', () => {
    expect(presentSizeOf(area(1920, 1080), area(384, 224), 16 / 9, 'whole')).toEqual(area(1920, 1120));
    expect(presentSizeOf(area(2560, 1080), area(512, 224), 2560 / 1080, 'whole')).toEqual(area(2560, 1120));
    expect(presentSizeOf(area(1920, 1080), area(480, 224), 21 / 9, 'whole')).toEqual(area(1920, 896));
    expect(presentSizeOf(area(810, 1080), area(256, 270), 3 / 4, 'whole')).toEqual(area(1024, 1080));
  });

  it('fills the stage with a frame planned on both axes', () => {
    expect(presentSizeOf(area(1920, 1080), area(480, 270), 16 / 9, 'whole')).toEqual(area(1920, 1080));
    expect(presentSizeOf(area(1280, 720), area(428, 240), 16 / 9, 'whole')).toEqual(area(1284, 720));
    expect(presentSizeOf(area(2560, 1440), area(428, 240), 16 / 9, 'whole')).toEqual(area(2568, 1440));
    expect(presentSizeOf(area(810, 1080), area(270, 360), 3 / 4, 'whole')).toEqual(area(810, 1080));
  });

  it('still covers with a frame planned for an older stage, never x4 with bars', () => {
    expect(presentSizeOf(area(1920, 1080), area(456, 224), 16 / 9, 'whole')).toEqual(area(2280, 1120));
  });

  it('keeps Original whole and inside the stage', () => {
    expect(presentSizeOf(area(1920, 1080), area(256, 224), 0, 'whole')).toEqual(area(1024, 896));
    expect(presentBoxOf(area(1920, 1080), area(256, 224), 0, 'whole')).toEqual(area(1024, 896));
  });
});
