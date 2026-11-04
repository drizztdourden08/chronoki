/* @layer tests @kind test */
import { describe, expect, it, vi } from 'vitest';
import { effectiveGatesOf } from '@app/settings-controls/effective-gates-of';
import { hasUnmetRequires } from '@app/settings-controls/has-unmet-requires';
import { isSettingDisabled } from '@app/settings-controls/is-setting-disabled';
import { DEFAULT_SETTINGS } from '@app/settings.constants';
import type { AppSettings } from '@app/settings.type';

vi.mock('@app/launch-flags/is-packaged', () => ({ isPackaged: () => false }));

const sourceValues = { view: 'full', refreshHz: 4 } as unknown as AppSettings;

describe('settings rows backed by a value source (widget prefs, no gates key)', { tags: ['critical'] }, () => {
  it('does not read gates for a key that is not a feature key', () => {
    expect(hasUnmetRequires('view', sourceValues)).toBe(false);
  });

  it('reports a plain widget pref as enabled without throwing', () => {
    expect(isSettingDisabled('refreshHz', sourceValues, null)).toBe(false);
  });

  it('disables a row whose lock cause is set (randomizer-frozen keys included)', () => {
    expect(isSettingDisabled('refreshHz', sourceValues, 'randomizer')).toBe(true);
  });

  it('tolerates a settings object with no gates list', () => {
    expect(() => effectiveGatesOf(sourceValues)).not.toThrow();
  });

  it('still resolves gates for full settings', () => {
    expect(effectiveGatesOf(DEFAULT_SETTINGS)).toBeInstanceOf(Set);
  });
});
