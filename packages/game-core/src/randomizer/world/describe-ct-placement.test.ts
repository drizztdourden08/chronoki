/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtPlacement } from './ct-placement.type';
import { describeCtPlacement } from './describe-ct-placement';

const placementOf = (locations: [string, string][], spheres: unknown[]): CtPlacement =>
  ({ seed: 'abc', locations, spheres }) as unknown as CtPlacement;
const rowsOf = (placement: CtPlacement) => Object.fromEntries(describeCtPlacement(placement).rows.map((row) => [row.label, row.value]));

describe('describeCtPlacement', { tags: ['critical'] }, () => {
  it('splits locations into treasure and key items', () => {
    const placement = placementOf([['a', 'treasure-01'], ['b', 'pendant'], ['c', 'treasure-02']], [[], []]);
    expect(describeCtPlacement(placement).seed).toBe('abc');
    expect(rowsOf(placement)).toEqual({ Locations: '3', Treasure: '2', 'Key items': '1', Spheres: '2' });
  });

  it('reports zeros for an empty placement', () => {
    expect(rowsOf(placementOf([], []))).toEqual({ Locations: '0', Treasure: '0', 'Key items': '0', Spheres: '0' });
  });
});
