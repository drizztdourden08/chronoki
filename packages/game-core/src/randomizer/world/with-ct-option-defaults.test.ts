/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CT_OPTION_CATALOG } from './ct-options.constants';
import { rollCtPlacement } from './roll-ct-placement';
import { withCtOptionDefaults } from './with-ct-option-defaults';

describe('withCtOptionDefaults', { tags: ['critical'] }, () => {
  it('fills every catalog default into an empty options object', () => {
    const filled = withCtOptionDefaults({});
    expect(Object.keys(filled).sort()).toEqual(CT_OPTION_CATALOG.map((option) => option.key).sort());
    expect(filled.partySize).toBe(CT_OPTION_CATALOG.find((option) => option.key === 'partySize')?.default);
  });

  it('keeps saved values over defaults', () => {
    expect(withCtOptionDefaults({ partySize: 2 }).partySize).toBe(2);
  });

  it('rolls an empty options object the same as one holding every default', () => {
    const everyDefault = Object.fromEntries(CT_OPTION_CATALOG.map((option) => [option.key, option.default]));
    const fromEmpty = rollCtPlacement({ checks: [], options: withCtOptionDefaults({}) }, 'seed-1');
    const fromFull = rollCtPlacement({ checks: [], options: everyDefault }, 'seed-1');
    expect(fromEmpty).toEqual(fromFull);
  });
});
