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

  it('runs every enabled planner and leaves a pack no planner can edit unchanged', () => {
    const result = applyQolToPack(pack, new Set(QOL_PACK_IDS));
    const handled = [...result.applied, ...result.skipped.map((skip) => skip.id)];
    expect([...handled].sort()).toEqual([...QOL_PACK_IDS].sort());
    expect([...result.bytes]).toEqual([1, 2, 3, 4]);
  });

  it('skips a planner that cannot work on the pack and gives its reasons', () => {
    const result = applyQolToPack(pack, new Set(['sightscopeBosses']));
    expect(result.applied).toEqual([]);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0]?.id).toBe('sightscopeBosses');
    expect(result.skipped[0]?.why.length).toBeGreaterThan(0);
  });

  it('runs only the enabled planners', () => {
    const result = applyQolToPack(pack, new Set(['fastTabs']));
    const handled = [...result.applied, ...result.skipped.map((skip) => skip.id)];
    expect(handled).toEqual(['fastTabs']);
  });
});
