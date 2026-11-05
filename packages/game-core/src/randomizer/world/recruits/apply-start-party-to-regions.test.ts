/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtRegionSpec } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import { applyModeToRegions } from '../modes/apply-mode-to-regions';
import { CT_MODES } from '../modes/ct-modes.constants';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyStartPartyToRegions } from './apply-start-party-to-regions';
import { LEGACY_PARTY } from './legacy-party.constants';

const STANDARD = CT_MODES[0]!;
const BASE = applyModeToRegions(CT_REGIONS, STANDARD);

const eventIdsOf = (specs: readonly CtRegionSpec[], id: CtRegionId): string[] =>
  specs.find((spec) => spec.id === id)?.events.map((event) => event.id) ?? [];

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
    const all = applyStartPartyToRegions(BASE, STANDARD.start, ['crono']).flatMap((spec) => spec.events.map((e) => e.id));
    for (const id of ['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla']) expect(all.filter((e) => e === id)).toHaveLength(1);
    expect(all).not.toContain('magus');
  });
});
