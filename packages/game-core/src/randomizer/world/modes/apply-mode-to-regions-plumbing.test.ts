/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyModeToRegions } from './apply-mode-to-regions';
import type { CtModeDef } from './ct-mode-def.type';
import { modeOf } from './mode-of';

const standard = modeOf();

const found = <T>(value: T | undefined): T => {
  if (value === undefined) throw new Error('Expected a value.');
  return value;
};

const withSpots = (): CtRegionSpec => found(CT_REGIONS.find((spec) => spec.spots.length > 0));

const withExits = (): CtRegionSpec => found(CT_REGIONS.find((spec) => spec.exits.length > 0));

const resultFor = (patch: Partial<CtModeDef>): CtRegionSpec[] => applyModeToRegions(CT_REGIONS, { ...standard, ...patch });

const specOf = (result: readonly CtRegionSpec[], id: CtRegionSpec['id']): CtRegionSpec =>
  found(result.find((spec) => spec.id === id));

describe('applyModeToRegions removals and events', () => {
  it('removes a named exit and keeps the others', { tags: ['critical'] }, () => {
    const from = withExits();
    const gone = found(from.exits[0]).to;
    const result = specOf(resultFor({ removedExits: [{ from: from.id, to: gone }] }), from.id);
    expect(result.exits.some((exit) => exit.to === gone)).toBe(false);
    expect(result.exits).toHaveLength(from.exits.length - 1);
  });

  it('removes a spot by id', { tags: ['critical'] }, () => {
    const from = withSpots();
    const gone = found(from.spots[0]).id;
    const result = specOf(resultFor({ removedSpots: [gone] }), from.id);
    expect(result.spots.some((spot) => spot.id === gone)).toBe(false);
  });

  it('removes a region with every exit that led to it', { tags: ['critical'] }, () => {
    const target = found(CT_REGIONS.find((spec) => CT_REGIONS.some((other) => other.exits.some((exit) => exit.to === spec.id))));
    const result = resultFor({ removedRegions: [target.id] });
    expect(result.some((spec) => spec.id === target.id)).toBe(false);
    expect(result.flatMap((spec) => spec.exits).some((exit) => exit.to === target.id)).toBe(false);
  });

  it('adds an extra event to its region with its rule', { tags: ['critical'] }, () => {
    const rule = CT_KIT.has('gate-key');
    const result = resultFor({ extraEvents: [{ id: 'beat-ozzie', region: 'present', rule }] });
    expect(specOf(result, 'present').events.at(-1)).toEqual({ id: 'beat-ozzie', rule });
    expect(result.filter((spec) => spec.id !== 'present')).toEqual(CT_REGIONS.filter((spec) => spec.id !== 'present'));
  });
});
