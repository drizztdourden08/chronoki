/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { applyQolToPack } from './apply-qol-to-pack';
import { QOL_PACK_IDS } from './qol-pack-planners.constants';

describe('applyQolToPack', { tags: ['critical'] }, () => {
  const pack = Uint8Array.from([1, 2, 3, 4]);

  it('returns the same bytes when nothing is enabled', () => {
    const result = applyQolToPack(pack, new Set());
    expect(result.bytes).toBe(pack);
    expect(result.applied).toEqual([]);
    expect(result.skipped).toEqual([]);
  });

  it('returns identical bytes with every stub planner enabled', () => {
    const result = applyQolToPack(pack, new Set(QOL_PACK_IDS));
    expect([...result.bytes]).toEqual([1, 2, 3, 4]);
    expect(result.applied).toEqual([...QOL_PACK_IDS]);
    expect(result.skipped).toEqual([]);
  });
});
