/* @layer tests @kind test */
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS } from '@app/settings.constants';
import { isSettingDisabled } from '@app/settings-controls/is-setting-disabled';

vi.mock('@app/launch-flags/is-packaged', () => ({ isPackaged: () => false }));

const withRatio = (aspectRatio: string) => ({ ...DEFAULT_SETTINGS, aspectRatio, vanillaSafe: false, gates: ['widescreen', 'extendY'] }) as typeof DEFAULT_SETTINGS;

describe('extendY control', { tags: ['critical'] }, () => {
  it('is disabled outside Original', () => {
    expect(isSettingDisabled('gate:extendY', withRatio('16:9'), null)).toBe(true);
  });

  it('is enabled in Original', () => {
    expect(isSettingDisabled('gate:extendY', withRatio('original'), null)).toBe(false);
  });
});
