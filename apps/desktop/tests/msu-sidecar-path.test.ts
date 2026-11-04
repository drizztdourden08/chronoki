/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ctSidecarPath } from '@chronoki/game-core';
import { slotRefOf } from '@chronoki/game-core';

describe('ctSidecarPath', { tags: ['critical'] }, () => {
  it('sits beside a quick save', () => {
    expect(ctSidecarPath('p1', { kind: 'quick', slot: 3 })).toBe('profiles/p1/saves/quick/save3.msu.json');
  });

  it('sits beside an auto save', () => {
    expect(ctSidecarPath('p1', { kind: 'auto', id: 'abc' })).toBe('profiles/p1/saves/auto/abc.msu.json');
  });

  it('rebuilds a slot reference from a kind and an id', () => {
    expect(slotRefOf('quick', '2')).toEqual({ kind: 'quick', slot: 2 });
    expect(slotRefOf('normal', 'x')).toEqual({ kind: 'normal', id: 'x' });
  });
});
