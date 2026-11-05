/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { buildCoreConfigIni } from './core-config-ini';

describe('duplicate_characters ini key', { tags: ['critical'] }, () => {
  it('is written under [chronoki] when the seed turns it on', () => {
    const ini = buildCoreConfigIni({}, { randomizer: true, disableGlitches: false, duplicateCharacters: true }).split('\n');
    expect(ini).toContain('[chronoki]');
    expect(ini).toContain('duplicate_characters=1');
  });

  it('is absent when off, and the ini is unchanged', () => {
    const base = buildCoreConfigIni({}, { randomizer: true, disableGlitches: false });
    expect(base).not.toContain('duplicate_characters');
    expect(buildCoreConfigIni({}, { randomizer: true, disableGlitches: false, duplicateCharacters: false })).toBe(base);
  });

  it('shares one [chronoki] section with the feature keys', () => {
    const ini = buildCoreConfigIni({ sightscope: true }, { randomizer: true, disableGlitches: false, duplicateCharacters: true });
    expect(ini.split('[chronoki]').length).toBe(2);
  });
});
