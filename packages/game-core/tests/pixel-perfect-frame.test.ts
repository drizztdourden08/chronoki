/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATE_OPTIONS, FEATURE_REGISTRY, resolveGates } from '@chronoki/features';
import { coverFrame, gateSettings, presentSizeOf } from '../src';

const WIDE = { minWidth: 256, maxWidth: 544, minHeight: 224, maxHeight: 224 };
const TALL = { minWidth: 256, maxWidth: 256, minHeight: 224, maxHeight: 480 };
const area = (width: number, height: number) => ({ width, height });

describe('pixel perfect frame planning', { tags: ['critical'] }, () => {
  it('renders 384x224 at x5 for 16:9 on 1920x1080, trimming 4 lines', () => {
    expect(coverFrame(area(1920, 1080), 16 / 9, WIDE)).toEqual({ width: 384, height: 224, scale: 5 });
  });

  it('renders 512x224 at x5 for the screen ratio on 2560x1080', () => {
    expect(coverFrame(area(2560, 1080), 2560 / 1080, WIDE)).toEqual({ width: 512, height: 224, scale: 5 });
  });

  it('keeps the scale whole and widens the frame when a larger scale would trim too much', () => {
    expect(coverFrame(area(2560, 1440), 16 / 9, WIDE)).toEqual({ width: 428, height: 224, scale: 6 });
    expect(coverFrame(area(2000, 1125), 16 / 9, WIDE)).toEqual({ width: 400, height: 224, scale: 5 });
  });

  it('covers a 21:9 box on a 16:9 screen at x4 with a 480 wide frame', () => {
    expect(coverFrame(area(1920, 1080), 21 / 9, WIDE)).toEqual({ width: 480, height: 224, scale: 4 });
  });

  it('plans a tall 3:4 frame as 256x360 at x3', () => {
    expect(coverFrame(area(1920, 1080), 3 / 4, TALL)).toEqual({ width: 256, height: 360, scale: 3 });
  });

  it('feeds the planned width to the core when a pixel area is given', () => {
    const { effective } = resolveGates(FEATURE_REGISTRY.map((f) => f.id), { vanillaSafe: false, satisfied: new Set(['steamData']) });
    const settings = gateSettings(effective, { ...DEFAULT_GATE_OPTIONS, pixelArea: area(1920, 1080) }, { volume: 100, mute: false });
    expect(settings.wideWidth).toBe(384);
  });
});

describe('canvas size on the stage', { tags: ['critical'] }, () => {
  it('fills the stage at the chosen ratio without pixel perfect', () => {
    expect(presentSizeOf(area(1920, 1080), area(398, 224), 16 / 9, 'fit')).toEqual(area(1920, 1080));
    expect(presentSizeOf(area(1920, 1080), area(522, 224), 21 / 9, 'fit')).toEqual(area(1920, 823));
    expect(presentSizeOf(area(1920, 1080), area(256, 224), 0, 'fit')).toEqual(area(1234, 1080));
  });

  it('keeps the frame shape when the ratio does not match the frame', () => {
    expect(presentSizeOf(area(1920, 1080), area(384, 224), 16 / 9, 'fit')).toEqual(area(1851, 1080));
  });

  it('scales a planned frame by a whole factor that covers the stage', () => {
    expect(presentSizeOf(area(1920, 1080), area(384, 224), 16 / 9, 'whole')).toEqual(area(1920, 1120));
    expect(presentSizeOf(area(2560, 1080), area(512, 224), 2560 / 1080, 'whole')).toEqual(area(2560, 1120));
    expect(presentSizeOf(area(1920, 1080), area(480, 224), 21 / 9, 'whole')).toEqual(area(1920, 896));
  });

  it('keeps Original whole and inside the stage', () => {
    expect(presentSizeOf(area(1920, 1080), area(256, 224), 0, 'whole')).toEqual(area(1024, 896));
  });
});
