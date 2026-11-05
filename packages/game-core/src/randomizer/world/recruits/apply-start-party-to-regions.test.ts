/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtRegionSpec } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import type { CtModeDef } from '../modes/ct-mode-def.type';
import { applyModeToRegions } from '../modes/apply-mode-to-regions';
import { CT_DEFAULT_MODE, CT_MODES } from '../modes/ct-modes.constants';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyStartPartyToRegions } from './apply-start-party-to-regions';
import { LEGACY_PARTY } from './legacy-party.constants';

const missingMode = (): never => {
  throw new Error('standard mode missing');
};
const STANDARD: CtModeDef = CT_MODES.find((mode) => mode.id === CT_DEFAULT_MODE) ?? missingMode();
const BASE = applyModeToRegions(CT_REGIONS, STANDARD);

const eventIdsOf = (specs: readonly CtRegionSpec[], id: CtRegionId): string[] =>
  specs.find((spec) => spec.id === id)?.events.map((event) => event.id) ?? [];

const allEventIdsOf = (specs: readonly CtRegionSpec[]): string[] => specs.flatMap((spec) => spec.events.map((event) => event.id));

describe('applyStartPartyToRegions', { tags: ['critical'] }, () => {
  it('keeps the old Crono + Marle event layout, in the old order', () => {
    const specs = applyStartPartyToRegions(BASE, STANDARD.start, LEGACY_PARTY);
    expect(eventIdsOf(specs, 'present')).toEqual(['crono', 'marle', 'kings-trial-done', 'masamune']);
    expect(eventIdsOf(specs, 'middle-ages')).toEqual(['frog', 'lucca']);
    expect(eventIdsOf(specs, 'future')).toEqual(['robo']);
    expect(eventIdsOf(specs, 'prehistory')).toEqual(['ayla']);
    expect(eventIdsOf(specs, 'death-peak')).toEqual([]);
  });

  it('puts starters in the start region and the rest at their recruit', () => {
    const specs = applyStartPartyToRegions(BASE, STANDARD.start, ['frog', 'magus', 'robo']);
    expect(eventIdsOf(specs, 'present')).toEqual(['frog', 'magus', 'robo', 'kings-trial-done', 'masamune']);
    expect(eventIdsOf(specs, 'middle-ages')).toEqual(['marle', 'lucca']);
    expect(eventIdsOf(specs, 'death-peak')).toEqual(['crono']);
    expect(eventIdsOf(specs, 'future')).toEqual([]);
    expect(eventIdsOf(specs, 'prehistory')).toEqual(['ayla']);
  });

  it('gives every character exactly one event, or none for a non-starting Magus', () => {
    const all = allEventIdsOf(applyStartPartyToRegions(BASE, STANDARD.start, ['crono']));
    const countOf = (id: string): number => all.filter((e) => e === id).length;
    expect(['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla'].map(countOf)).toEqual([1, 1, 1, 1, 1, 1]);
    expect(all).not.toContain('magus');
  });
});
