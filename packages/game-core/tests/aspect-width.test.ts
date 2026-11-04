/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATE_OPTIONS, FEATURE_REGISTRY, resolveGates } from '@chronoki/features';
import type { AspectRatioChoice } from '@chronoki/features';
import { frameSizeOf, gateSettings, letterboxBox, parseRatio, ratioToWidth } from '../src';

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

describe('gate settings width', { tags: ['critical'] }, () => {
  const audio = { volume: 100, mute: false };
  const ALL = FEATURE_REGISTRY.map((feature) => feature.id);
  const widthFor = (vanillaSafe: boolean, aspectRatio: AspectRatioChoice, requested = ALL): number => {
    const { effective } = resolveGates(requested, { vanillaSafe, satisfied: new Set(['steamData']) });
    return gateSettings(effective, { ...DEFAULT_GATE_OPTIONS, aspectRatio }, audio).wideWidth;
  };

  it('gives width 256 and widescreen off in Vanilla Safe for every ratio', () => {
    for (const choice of ['original', '4:3', '16:9', '21:9', '3:4', 'custom'] as const) expect(widthFor(true, choice)).toBe(0);
    const { effective } = resolveGates(ALL, { vanillaSafe: true });
    const settings = gateSettings(effective, DEFAULT_GATE_OPTIONS, audio);
    expect(settings.widescreen).toBe('off');
    expect(frameSizeOf({ ...settings, renderScale: 1 }).width).toBe(256);
  });

  it('writes a non-off widescreen placeholder with the width for wide ratios', () => {
    const { effective } = resolveGates(ALL, { vanillaSafe: false });
    const settings = gateSettings(effective, { ...DEFAULT_GATE_OPTIONS, aspectRatio: '4:3' }, audio);
    expect([settings.widescreen, settings.wideWidth]).toEqual(['16:9', 298]);
  });

  it('falls back from a tall ratio to 4:3 when tall rendering is off', () => {
    const requested = ALL.filter((id) => id !== 'tallRendering');
    expect(widthFor(false, '3:4', requested)).toBe(298);
    expect(widthFor(false, '3:4')).toBe(0);
  });
});

describe('configured wide width',{ tags: ['critical'] }, () => {
  it('makes the frame as wide as the configured width at 224 lines', () => {
    const settings = { widescreen: '16:9', wideWidth: 298, renderScale: 1, interpolation: false } as const;
    expect(frameSizeOf(settings)).toEqual({ width: 298, height: 224 });
  });
});
