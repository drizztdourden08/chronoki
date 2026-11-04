/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATE_OPTIONS, FEATURE_REGISTRY, resolveGates } from '@chronoki/features';
import { buildCoreConfigIni, gateSettings } from '../src';
import { readSettingsC } from './support/find-settings-c';
import { renderDefaultIni } from './support/render-default-ini';
import { ENUM_DEFAULT_SOURCES } from './support/settings-c.constants';

const audio = { volume: 100, mute: false };
const settingsC = readSettingsC();
const withReference = settingsC ? it : it.skip;

const ALL_REQUESTED = FEATURE_REGISTRY.map((feature) => feature.id);

describe('all gates off equals original', { tags: ['critical'] }, () => {
  withReference('writes the ini Belthasar writes on first run, byte for byte', () => {
    const { effective } = resolveGates([], { vanillaSafe: false });
    const ini = buildCoreConfigIni(gateSettings(effective, DEFAULT_GATE_OPTIONS, audio));
    expect(ini).toBe(renderDefaultIni(settingsC ?? ''));
  });

  withReference('reads the enum defaults the writer assumes out of settings.c', () => {
    for (const pattern of ENUM_DEFAULT_SOURCES) expect(settingsC).toMatch(pattern);
  });

  it('original mode with every gate requested writes the same file as no gate', () => {
    const off = resolveGates([], { vanillaSafe: false });
    const original = resolveGates(ALL_REQUESTED, { vanillaSafe: true, satisfied: new Set(['steamData']) });
    const ini = (effective: ReadonlySet<string>): string =>
      buildCoreConfigIni(gateSettings(effective, DEFAULT_GATE_OPTIONS, audio));
    expect(ini(original.effective)).toBe(ini(off.effective));
  });

  it('turns each core gate into exactly its own key when on', () => {
    const { effective } = resolveGates(ALL_REQUESTED, { vanillaSafe: false, satisfied: new Set(['steamData']) });
    const ini = buildCoreConfigIni(gateSettings(effective, DEFAULT_GATE_OPTIONS, audio));
    for (const line of ['widescreen=16:9', 'render_scale=2', 'interpolation=1', 'steam_margins=1', 'fill_bottom_lines=1',
      'scene_adjustments=1', 'sync=free', 'instant_sound_uploads=1']) {
      expect(ini.split('\n')).toContain(line);
    }
  });
});
