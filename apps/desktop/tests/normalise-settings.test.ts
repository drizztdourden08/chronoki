/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '@app/settings.constants';
import { normaliseSettings } from '@app/settings-effects/normalise-settings';
import type { RawSettings } from '@app/settings-effects/normalise-settings.type';

const load = (stored: RawSettings) => normaliseSettings({ ...DEFAULT_SETTINGS, ...stored }, stored);

describe('aspect ratio migration', { tags: ['critical'] }, () => {
  it('loads an old widescreenAspect 21:9 as aspectRatio 21:9 and drops the old key', () => {
    const settings = load({ widescreenAspect: '21:9', vanillaSafe: false });
    expect(settings.aspectRatio).toBe('21:9');
    expect('widescreenAspect' in settings).toBe(false);
  });

  it('keeps a stored aspectRatio over a leftover widescreenAspect key', () => {
    expect(load({ aspectRatio: 'custom', widescreenAspect: '16:9', vanillaSafe: false }).aspectRatio).toBe('custom');
  });

  it('defaults a new install to 16:9', () => {
    expect(load({ vanillaSafe: false }).aspectRatio).toBe('16:9');
  });
});

describe('tall rendering cascade', { tags: ['critical'] }, () => {
  it('puts a tall ratio back to 4:3 when tall rendering is off', () => {
    expect(load({ aspectRatio: '3:4', gates: ['widescreen'], vanillaSafe: false }).aspectRatio).toBe('4:3');
  });

  it('keeps a tall ratio when tall rendering is on', () => {
    expect(load({ aspectRatio: '3:4', gates: ['widescreen', 'tallRendering'], vanillaSafe: false }).aspectRatio).toBe('3:4');
  });
});

describe('default-on feature migration', { tags: ['critical'] }, () => {
  it('turns on default features an old profile has never seen', () => {
    const settings = load({ gates: ['widescreen'], vanillaSafe: false });
    expect(settings.gates).toContain('gameInfo');
    expect(settings.gates).toContain('perGroupVolume');
  });

  it('gives an old profile extendY, cameraLock and edgeEffect', () => {
    const settings = load({ gates: ['widescreen'], vanillaSafe: false });
    expect(settings.gates).toEqual(expect.arrayContaining(['extendY', 'cameraLock', 'edgeEffect']));
  });

  it('keeps a feature off when the profile already knew it', () => {
    const settings = load({ gates: ['widescreen'], knownGates: ['gameInfo', 'perGroupVolume'], vanillaSafe: false });
    expect(settings.gates).not.toContain('gameInfo');
    expect(settings.gates).not.toContain('perGroupVolume');
  });

  it('records every known feature id', () => {
    expect(load({ vanillaSafe: false }).knownGates).toContain('gameInfo');
  });
});
