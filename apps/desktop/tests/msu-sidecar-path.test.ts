/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { sidecarPath } from '@app/game/msu-save-glue/sidecar-path';
import { slotRefOf } from '@app/game/msu-save-glue/slot-ref-of';

describe('sidecarPath', { tags: ['critical'] }, () => {
  it('sits beside a quick save', () => {
    expect(sidecarPath('p1', { kind: 'quick', slot: 3 })).toBe('profiles/p1/saves/quick/save3.msu.json');
  });

  it('sits beside an auto save', () => {
    expect(sidecarPath('p1', { kind: 'auto', id: 'abc' })).toBe('profiles/p1/saves/auto/abc.msu.json');
  });

  it('rebuilds a slot reference from a kind and an id', () => {
    expect(slotRefOf('quick', '2')).toEqual({ kind: 'quick', slot: 2 });
    expect(slotRefOf('normal', 'x')).toEqual({ kind: 'normal', id: 'x' });
  });
});
