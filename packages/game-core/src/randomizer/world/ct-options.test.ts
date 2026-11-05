/* @layer bridge-wasm @kind logic */
import { describe, expect, it } from 'vitest';
import { CT_OPTION_CATALOG } from './ct-options.constants';
import { ctOptionValues } from './ct-option-values';
import { ctUiOptions } from './ct-ui-options';

describe('ct options', { tags: ['critical'] }, () => {
  it('shows an unimplemented option only frozen with a hint', () => {
    const implemented = new Set(CT_OPTION_CATALOG.filter((option) => option.implemented).map((option) => option.key));
    for (const option of ctUiOptions()) {
      expect(option.frozen === true || implemented.has(option.key)).toBe(true);
      if (!implemented.has(option.key)) expect(option.hint).toBeTruthy();
    }
  });

  it('defaults the tab options to the vanilla behaviour and covers them in the seed hash values', () => {
    const values = ctOptionValues();
    expect(values.tabsanity).toBe(false);
    for (const key of ['powerTabMin', 'powerTabMax', 'magicTabMin', 'magicTabMax', 'speedTabMin', 'speedTabMax']) {
      expect(values[key]).toBe(1);
    }
    expect(ctOptionValues({ powerTabMax: 5 }).powerTabMax).toBe(5);
  });

  it('keeps unimplemented options out of the values the seed hash covers', () => {
    const keys = Object.keys(ctOptionValues({ addOzzieSpot: true, itemDifficulty: 'hard' }));
    const expected = CT_OPTION_CATALOG.filter((option) => option.implemented).map((option) => option.key);
    expect(keys.sort()).toEqual(expected.sort());
    expect(keys).not.toContain('notAnOption');
  });

  it('puts the logic tweaks into the values the seed hash covers, off by default', () => {
    const off = ctOptionValues();
    const on = ctOptionValues({ addCyrusGraveSpot: true, addOzzieSpot: true, vanillaRoboRibbon: true });
    (['addCyrusGraveSpot', 'addOzzieSpot', 'vanillaRoboRibbon'] as const).forEach((key) => {
      expect(off[key]).toBe(false);
      expect(on[key]).toBe(true);
    });
  });
});
