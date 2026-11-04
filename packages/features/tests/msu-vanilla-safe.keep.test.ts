/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { isVanillaSafeLockedSetting, lockCauseOf, resolveGates } from '../src';

const MSU_KEYS = ['enableMSU', 'msuConfigMode', 'resumeMSU', 'resetMSUAtTitle', 'msuChipFallback', 'packReplaceSfx'];
const SAVED = ['perGroupVolume', 'saveStates'];

describe('msu under vanilla safe', { tags: ['critical'] }, () => {
  it('locks the six MSU keys', () => {
    expect(MSU_KEYS.filter((key) => !isVanillaSafeLockedSetting(key))).toEqual([]);
  });

  it('strips the independent volume feature and names the cause', () => {
    const on = resolveGates(SAVED, { vanillaSafe: true, satisfied: new Set<string>() });
    expect(on.effective.has('perGroupVolume')).toBe(false);
    expect(lockCauseOf('perGroupVolume', { vanillaSafe: true, enabled: on.effective })).toBe('vanillaSafe');
  });

  it('restores the saved choices when it is off', () => {
    const off = resolveGates(SAVED, { vanillaSafe: false, satisfied: new Set<string>() });
    expect(off.effective.has('perGroupVolume')).toBe(true);
    expect(lockCauseOf('perGroupVolume', { vanillaSafe: false, enabled: off.effective })).toBeNull();
  });
});
