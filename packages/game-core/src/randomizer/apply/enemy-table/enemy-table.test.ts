/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { syntheticEnemyPack } from './enemy-table.fixture';
import { planEnemyScale } from './plan-enemy-scale';
import { readEnemyStats } from './read-enemy-stats';

describe('enemy table', () => {
  it('reads the stat and reward records of an enemy', { tags: ['critical'] }, () => {
    const enemy = readEnemyStats(syntheticEnemyPack())[3];
    expect(enemy?.values).toEqual({
      hp: 300, level: 10, stamina: 5, speed: 6, magic: 7, hit: 100, evade: 9, magicDefense: 30,
      attack: 20, defense: 40, xp: 200, gold: 50, tp: 9,
    });
  });

  it('returns nothing for a buffer that is not a pack', { tags: ['critical'] }, () => {
    expect(readEnemyStats(new Uint8Array(64))).toEqual([]);
  });

  it('plans scaled edits with old values, clamped to field ranges', { tags: ['critical'] }, () => {
    const pack = syntheticEnemyPack();
    const edits = planEnemyScale(readEnemyStats(pack), [3], 3, ['hp', 'attack', 'level', 'tp']);
    const byWhy = (why: string) => edits.filter((e) => e.why === why);
    expect(byWhy('enemy-3-hp').map((e) => [e.old, e.next])).toEqual([[300 & 0xff, 900 & 0xff], [1, 3]]);
    expect(byWhy('enemy-3-attack')[0]).toMatchObject({ old: 20, next: 60 });
    expect(byWhy('enemy-3-level')[0]?.next).toBe(30);
    expect(byWhy('enemy-3-tp')[0]?.next).toBe(27);
    edits.forEach((e) => expect(pack[e.at]).toBe(e.old));
  });

  it('clamps at the field maximum and skips unchanged and unlisted enemies', { tags: ['critical'] }, () => {
    const stats = readEnemyStats(syntheticEnemyPack());
    expect(planEnemyScale(stats, [3], 100, ['level', 'tp']).map((e) => e.next)).toEqual([99, 0xff]);
    expect(planEnemyScale(stats, [3], 1, ['hp', 'xp'])).toEqual([]);
    expect(planEnemyScale(stats, [4], 2, ['hp'])).toEqual([]);
  });
});
