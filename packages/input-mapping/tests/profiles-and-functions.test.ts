/* @layer test @kind test */
import { describe, it, expect } from 'vitest';
import type { InputProfile } from '../src';
import { DEFAULT_FUNCTION_MAPPINGS, FUNCTION_ACTIONS, FunctionActionEngine, KEYBOARD_DEFAULT, cycleProfile, parseInputProfiles, profileFromPreset } from '../src';

const named = (id: string): InputProfile => ({ ...profileFromPreset(KEYBOARD_DEFAULT), id, isDefault: false });

describe('profiles', { tags: ['critical'] }, () => {
  it('builds a default keyboard profile from the preset', () => {
    const profile = profileFromPreset(KEYBOARD_DEFAULT);
    expect(profile.deviceType).toBe('keyboard');
    expect(profile.isDefault).toBe(true);
    expect(profile.mappings).toHaveLength(12);
  });

  it('keeps only well-formed profiles from input-profiles.json', () => {
    const good = named('a');
    expect(parseInputProfiles([good, { id: 1 }, null, 'x'])).toEqual([good]);
    expect(parseInputProfiles({})).toEqual([]);
  });

  it('cycles forward and backward through several profiles and wraps', () => {
    const profiles = [named('a'), named('b'), named('c')];
    expect(cycleProfile(profiles, 'a', 1)?.id).toBe('b');
    expect(cycleProfile(profiles, 'c', 1)?.id).toBe('a');
    expect(cycleProfile(profiles, 'a', -1)?.id).toBe('c');
  });

  it('does not cycle with a single profile', () => {
    expect(cycleProfile([named('a')], 'a', 1)).toBeNull();
  });
});

describe('FunctionActionEngine', { tags: ['critical'] }, () => {
  it('has a default mapping for every function action', () => {
    expect(DEFAULT_FUNCTION_MAPPINGS.map((m) => m.action).sort()).toEqual([...FUNCTION_ACTIONS].sort());
  });

  it('fires the callback of a key bound by default', () => {
    const engine = new FunctionActionEngine();
    let fired = 0;
    engine.onAction('screenshot', () => { fired += 1; });
    expect(engine.handleKeyDown('F12', false, false, false)).toBe(true);
    expect(fired).toBe(1);
  });

  it('routes the pause action to onPauseToggle', () => {
    const engine = new FunctionActionEngine();
    let toggled = 0;
    engine.onPauseToggle = () => { toggled += 1; };
    engine.setMappings([{ action: 'pause', binding: { type: 'keyboard', code: 'KeyP' }, icon: null }]);
    engine.handleKeyDown('KeyP', false, false, false);
    expect(toggled).toBe(1);
  });

  it('respects modifiers', () => {
    const engine = new FunctionActionEngine();
    engine.setMappings([{ action: 'save-state', binding: { type: 'keyboard', code: 'KeyS', modifiers: { ctrl: true } }, icon: null }]);
    expect(engine.handleKeyDown('KeyS', false, false, false)).toBe(false);
    expect(engine.handleKeyDown('KeyS', false, true, false)).toBe(true);
  });
});
