/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { syntheticEnemyPack } from '../enemy-table/enemy-table.fixture';
import { bossDepthsOf } from './boss-depths-of';
import { BOSS_SPOT_ENEMIES, OTHER_BOSS_IDS } from './boss-map.constants';
import { planEnemyOptionEdits } from './plan-enemy-option-edits';

describe('enemy option edits', () => {
  it('plans nothing with both options off', { tags: ['critical'] }, () => {
    expect(planEnemyOptionEdits(syntheticEnemyPack(), {})).toEqual([]);
    expect(planEnemyOptionEdits(syntheticEnemyPack(), { hardEnemies: false })).toEqual([]);
  });

  it('hard enemies scale regular enemies against the pack values', { tags: ['critical'] }, () => {
    const pack = syntheticEnemyPack();
    const edits = planEnemyOptionEdits(pack, { hardEnemies: true });
    expect(edits.length).toBeGreaterThan(0);
    edits.forEach((e) => expect(pack[e.at]).toBe(e.old));
  });

  it('no enemy id guards two spots or is also a plain boss', { tags: ['critical'] }, () => {
    const all = [...Object.values(BOSS_SPOT_ENEMIES).flat(), ...OTHER_BOSS_IDS];
    expect(new Set(all).size).toBe(all.length);
  });

  it('boss depth is the sphere index of a guarded spot', { tags: ['critical'] }, () => {
    const depths = bossDepthsOf([{ index: 0, locations: ['x'] }, { index: 1, locations: ['ki-taban'] }]);
    expect(depths.get('ki-taban')).toBe(1);
    expect(depths.has('x')).toBe(false);
  });
});
