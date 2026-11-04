/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../checks/check.type';
import type { CtPlacement } from '../world/ct-placement.type';
import { planPackPlacement } from './plan-pack-placement';

const check = (id: string): CheckDef => ({ id, kind: 'chest', locationId: 1, vanillaItem: 0 });
const placementOf = (locations: [string, string][]): CtPlacement =>
  ({ seed: 's', locations, spheres: [] }) as unknown as CtPlacement;

describe('planPackPlacement', { tags: ['critical'] }, () => {
  it('puts treasure on known checks into the pack with its ROM id', () => {
    const plan = planPackPlacement(placementOf([['chest-a', 'treasure-1f']]), [check('chest-a')]);
    expect(plan.pack).toEqual({ 'chest-a': 0x1f });
    expect(plan.items.get('chest-a')).toBe('treasure-1f');
    expect(plan.virtual).toEqual([]);
    expect(plan.unbound).toBe(0);
  });

  it('keeps key items virtual: not in the pack, still bound to a check', () => {
    const plan = planPackPlacement(placementOf([['chest-a', 'pendant']]), [check('chest-a')]);
    expect(plan.pack).toEqual({});
    expect(plan.virtual).toEqual([['chest-a', 'pendant']]);
    expect(plan.unbound).toBe(0);
  });

  it('counts a location without a check as unbound and virtual', () => {
    const plan = planPackPlacement(placementOf([['gold-chest', 'treasure-05']]), [check('chest-a')]);
    expect(plan.pack).toEqual({});
    expect(plan.virtual).toEqual([['gold-chest', 'treasure-05']]);
    expect(plan.unbound).toBe(1);
  });

  it('returns an empty plan for an empty placement', () => {
    const plan = planPackPlacement(placementOf([]), [check('chest-a')]);
    expect(plan).toEqual({ pack: {}, items: new Map(), virtual: [], unbound: 0 });
  });
});
