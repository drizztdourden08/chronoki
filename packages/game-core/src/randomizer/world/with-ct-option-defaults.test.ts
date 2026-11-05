/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CT_OPTION_CATALOG } from './ct-options.constants';
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

  it('turns an empty options object into exactly the catalog defaults', () => {
    const everyDefault = Object.fromEntries(CT_OPTION_CATALOG.map((option) => [option.key, option.default]));
    expect(withCtOptionDefaults({})).toEqual(everyDefault);
  });
});
