/* @layer bridge-wasm @kind logic */
import { describe, expect, it } from 'vitest';
import { CT_KIT } from '../ct-kit.constants';
import { CT_OPTION_CATALOG } from '../ct-options.constants';
import { exitNameOf } from '../exit-name-of';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyModeToRegions } from './apply-mode-to-regions';
import type { CtModeDef } from './ct-mode-def.type';
import { CT_MODES } from './ct-modes.constants';
import { modeOf } from './mode-of';

const standard = modeOf();

describe('modeOf', () => {
  it('defaults to standard', () => {
    expect(modeOf().id).toBe('standard');
    expect(modeOf({ gameMode: 'standard' })).toBe(standard);
  });

  it('refuses unknown and unimplemented modes instead of falling back', () => {
    expect(() => modeOf({ gameMode: 'nope' })).toThrow(/Unknown game mode/);
    for (const mode of CT_MODES.filter((candidate) => !candidate.implemented)) {
      expect(() => modeOf({ gameMode: mode.id })).toThrow(/not available yet/);
    }
  });
});

describe('applyModeToRegions', () => {
  it('leaves the regions as they are for standard', () => {
    expect(applyModeToRegions(CT_REGIONS, standard)).toEqual(CT_REGIONS);
  });

  it('drops regions of other eras with their exits', () => {
    const noFuture: CtModeDef = { ...standard, eras: standard.eras.filter((era) => era !== 'future') };
    const result = applyModeToRegions(CT_REGIONS, noFuture);
    expect(result.some((spec) => spec.era === 'future')).toBe(false);
    const dropped = new Set(CT_REGIONS.filter((spec) => spec.era === 'future').map((spec) => spec.id));
    expect(result.flatMap((spec) => spec.exits).some((exit) => dropped.has(exit.to))).toBe(false);
  });

  it('patches an exit rule by name and adds extra exits', () => {
    const exit = CT_REGIONS.flatMap((spec) => spec.exits.map((to) => ({ from: spec.id, to: to.to })))[0]!;
    const rule = CT_KIT.has('gate-key');
    const patched: CtModeDef = {
      ...standard,
      rulePatches: { exits: { [exitNameOf(exit.from, exit.to)]: rule } },
      extraExits: [{ from: 'present', to: 'end-of-time', rule }],
    };
    const result = applyModeToRegions(CT_REGIONS, patched);
    const from = result.find((spec) => spec.id === exit.from)!;
    expect(from.exits.find((candidate) => candidate.to === exit.to)?.rule).toBe(rule);
    const present = result.find((spec) => spec.id === 'present')!;
    expect(present.exits.at(-1)).toEqual({ to: 'end-of-time', rule });
  });
});

describe('gameMode option', () => {
  const option = CT_OPTION_CATALOG.find((candidate) => candidate.key === 'gameMode')!;

  it('is not frozen and lists every mode', () => {
    expect(option.frozen).not.toBe(true);
    expect(option.choices).toEqual(CT_MODES.map((mode) => mode.id));
  });

  it('marks unimplemented modes disabled', () => {
    expect(option.disabledChoices).toEqual(CT_MODES.filter((mode) => !mode.implemented).map((mode) => mode.id));
    expect(option.disabledChoices).not.toContain('standard');
  });
});
