/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../checks/check.type';
import { ctPollEntries } from './ct-poll-entries';

const def = (over: Partial<CheckDef> & { id: string }): CheckDef => ({ kind: 'chest', locationId: 1, vanillaItem: 0, ...over });
const probe = { region: 'wram', offset: 0x10, mask: 0x04, compare: 'set' } as const;

describe('ctPollEntries', { tags: ['critical'] }, () => {
  it('polls a placed chest through its flag probe', () => {
    const entries = ctPollEntries([def({ id: 'c1', probe })], { c1: 3 });
    expect(entries).toEqual([{ key: 'c1', probe: { region: 'wram', offset: 0x10, mask: 0x04 } }]);
  });

  it('polls a placed gift without a probe by check id', () => {
    expect(ctPollEntries([def({ id: 'g1', kind: 'gift' })], { g1: 3 })).toEqual([{ key: 'g1', checkId: 'g1' }]);
  });

  it('skips checks that carry no item in the pack', () => {
    expect(ctPollEntries([def({ id: 'c1', probe }), def({ id: 'g1', kind: 'gift' })], {})).toEqual([]);
  });

  it('skips a placed non-gift check that has no probe', () => {
    expect(ctPollEntries([def({ id: 'e1', kind: 'event' })], { e1: 3 })).toEqual([]);
  });

  it('builds a custom probe for a clear-compare flag', () => {
    const [entry] = ctPollEntries([def({ id: 'c1', probe: { ...probe, compare: 'clear' } })], { c1: 3 });
    expect(entry?.probe).toHaveProperty('custom');
  });
});
