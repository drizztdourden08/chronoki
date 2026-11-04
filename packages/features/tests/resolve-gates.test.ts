/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { FEATURES_BY_ID, FEATURE_REGISTRY, lockCauseOf, resolveFeatures, resolveGates } from '../src';

const ALL = FEATURE_REGISTRY.map((feature) => feature.id);
const STEAM = new Set(['steamData']);
const ALLOWED_IN_ORIGINAL = ['saveStates', 'autoSave', 'saveOnQuit', 'developerTools'];

describe('original mode', { tags: ['critical'] }, () => {
  it('leaves no feature that changes the game', () => {
    const { effective } = resolveGates(ALL, { vanillaSafe: true, satisfied: STEAM });
    expect([...effective].filter((id) => FEATURES_BY_ID[id]?.affectsVanillaParity)).toEqual([]);
  });

  it('keeps save states, auto-save, save on quit and developer tools', () => {
    const { effective } = resolveGates(ALL, { vanillaSafe: true, satisfied: STEAM });
    expect([...effective].sort()).toEqual([...ALLOWED_IN_ORIGINAL].sort());
  });

  it('drops developer tools in a packaged build', () => {
    const { effective } = resolveGates(ALL, { vanillaSafe: false, packaged: true, satisfied: STEAM });
    expect(effective.has('developerTools')).toBe(false);
  });
});

describe('requirements', { tags: ['critical'] }, () => {
  it('drops a feature whose requirement is off and cascades', () => {
    const { effective, autoDisabled } = resolveFeatures(['sceneAdjust', 'wideSteamMargins'], STEAM);
    expect(effective.size).toBe(0);
    expect(autoDisabled.map((entry) => entry.id).sort()).toEqual(['sceneAdjust', 'wideSteamMargins']);
  });

  it('keeps Steam margins only with widescreen and the Steam data', () => {
    expect(resolveFeatures(['widescreen', 'wideSteamMargins']).effective.has('wideSteamMargins')).toBe(false);
    expect(resolveFeatures(['widescreen', 'wideSteamMargins'], STEAM).effective.has('wideSteamMargins')).toBe(true);
  });

  it('names the cause that locks a control', () => {
    const base = { vanillaSafe: false, enabled: new Set<string>() };
    expect(lockCauseOf('widescreen', { ...base, vanillaSafe: true })).toBe('vanillaSafe');
    expect(lockCauseOf('sceneAdjust', base)).toBe('requires');
    expect(lockCauseOf('wideSteamMargins', { ...base, enabled: new Set(['widescreen']) })).toBe('missingData');
    expect(lockCauseOf('developerTools', { ...base, packaged: true })).toBe('developerBuild');
    expect(lockCauseOf('fillBottomLine', base)).toBeNull();
  });
});
