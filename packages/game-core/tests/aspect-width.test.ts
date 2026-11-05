/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATE_OPTIONS, FEATURE_REGISTRY, resolveGates } from '@chronoki/features';
import type { AspectRatioChoice } from '@chronoki/features';
import { resolveFrame } from '../src/port/aspect/resolve-frame';
import { buildCoreConfigIni, frameSizeOf, gateSettings, parseRatio, ratioToLines, ratioToWidth } from '../src';

describe('ratio to picture width', { tags: ['critical'] }, () => {
  it('gives 298, 358, 398 and 522 for 4:3, 16:10, 16:9 and 21:9', () => {
    expect(['4:3', '16:10', '16:9', '21:9'].map((r) => ratioToWidth(parseRatio(r)))).toEqual([298, 358, 398, 522]);
  });
});

describe('240 line ratios', { tags: ['critical'] }, () => {
  const effective = new Set(['widescreen', 'tallRendering']);
  const frameFor = (aspectRatio: AspectRatioChoice, gates: ReadonlySet<string> = effective) =>
    resolveFrame(gates, { ...DEFAULT_GATE_OPTIONS, aspectRatio });

  it('renders 4:3 as a true 320x240 and 16:9 as 426x240', () => {
    expect(frameFor('4:3')).toEqual({ width: 320, lines: 240 });
    expect(frameFor('16:9')).toEqual({ width: 426, lines: 240 });
    expect(frameFor('16:10')).toEqual({ width: 384, lines: 240 });
  });

  it('caps 21:9 at the 544 wide motion buffer, dropping to 234 lines', () => {
    expect(frameFor('21:9')).toEqual({ width: 544, lines: 234 });
  });

  it('keeps Original at 256x224, or 256x240 with Extend Y', () => {
    expect(frameFor('original')).toEqual({ width: 256, lines: 224 });
    expect(frameFor('original', new Set(['widescreen', 'extendY']))).toEqual({ width: 256, lines: 240 });
    expect(frameFor('original', new Set(['extendY']))).toEqual({ width: 256, lines: 224 });
  });

  it('takes the base lines as a parameter', () => {
    expect(ratioToWidth(parseRatio('4:3'), 1, 240)).toBe(320);
    expect(ratioToLines(parseRatio('16:9'), 1, 240)).toBe(240);
  });
});

describe('custom ratio cap', { tags: ['critical'] }, () => {
  it('caps a 3:1 ratio at 544', () => {
    expect(ratioToWidth(parseRatio('3:1'))).toBe(544);
  });
});

describe('tall ratio lines', { tags: ['critical'] }, () => {
  it('gives 320 and 340 lines for 4:5 and 3:4, capped at 480', () => {
    expect(['4:5', '3:4', '1:3'].map((r) => ratioToLines(parseRatio(r)))).toEqual([320, 340, 480]);
  });

  it('applies the pixel aspect: 3:4 and 4:3 aspect (8/7), clamped to 224..480', () => {
    expect(ratioToLines(parseRatio('3:4'), 8 / 7)).toBe(390);
    expect(ratioToLines(parseRatio('4:3'), 8 / 7)).toBe(224);
    expect(ratioToLines(parseRatio('1:3'))).toBe(480);
    expect(ratioToLines(parseRatio('16:9'))).toBe(224);
    expect(ratioToWidth(parseRatio('4:3'), 8 / 7)).toBe(260);
  });

  it('sizes the frame W k x H k: tall, wide, both, and the original', () => {
    const base = { widescreen: 'off', wideWidth: 0, tallLines: 340, renderScale: 2, interpolation: true } as const;
    expect(frameSizeOf(base)).toEqual({ width: 256 * 2, height: 340 * 2 });
    expect(frameSizeOf({ ...base, renderScale: 3, interpolation: false })).toEqual({ width: 768, height: 1020 });
    expect(frameSizeOf({ ...base, widescreen: '16:9', wideWidth: 398, renderScale: 1, interpolation: false })).toEqual({ width: 398, height: 340 });
    expect(frameSizeOf({ ...base, tallLines: 600, renderScale: 1, interpolation: false }).height).toBe(480);
    expect(frameSizeOf({ ...base, tallLines: 0, renderScale: 1, interpolation: false })).toEqual({ width: 256, height: 224 });
  });

  it('writes tall_lines only for a tall picture', () => {
    expect(buildCoreConfigIni({ tallLines: 340 }).split('\n')).toContain('tall_lines=340');
    expect(buildCoreConfigIni({ widescreen: '16:9', wideWidth: 398, tallLines: 340 })).toContain('tall_lines=340');
    expect(buildCoreConfigIni({ widescreen: '16:9', wideWidth: 398 })).not.toContain('tall_lines');
    expect(buildCoreConfigIni({ tallLines: 340 })).not.toContain('wide_width');
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
    expect([settings.widescreen, settings.wideWidth]).toEqual(['16:9', 320]);
  });

  it('falls back from a tall ratio to 4:3 when tall rendering is off', () => {
    const requested = ALL.filter((id) => id !== 'tallRendering');
    expect(widthFor(false, '3:4', requested)).toBe(320);
    expect(widthFor(false, '3:4')).toBe(0);
  });

  it('renders a tall ratio as 256 x lines with widescreen off, keeping the render scale', () => {
    const { effective } = resolveGates(ALL, { vanillaSafe: false, satisfied: new Set(['steamData']) });
    const settings = gateSettings(effective, { ...DEFAULT_GATE_OPTIONS, aspectRatio: '3:4' }, audio);
    expect([settings.widescreen, settings.tallLines, settings.interpolation]).toEqual(['off', 340, true]);
  });
});

describe('configured wide width',{ tags: ['critical'] }, () => {
  it('makes the frame as wide as the configured width at 224 lines', () => {
    const settings = { widescreen: '16:9', wideWidth: 298, renderScale: 1, interpolation: false } as const;
    expect(frameSizeOf(settings)).toEqual({ width: 298, height: 224 });
  });
});
