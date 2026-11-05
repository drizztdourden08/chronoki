/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { bossRowsOf } from '../../world/boss-rows-of';
import { applyOptionsOf } from '../enemy-difficulty/apply-options-of';
import { readEnemyStats } from '../enemy-table/read-enemy-stats';
import { findSceneScript } from '../script/find-scene-script';
import type { PackEdit } from '../apply-seed.type';
import { bossAssignmentOf } from './boss-assignment-of';
import type { BossAssignment } from './boss-rando.type';
import { syntheticBossPack } from './boss-rando.fixture';
import { hpOf } from './hp-of.fixture';
import { levelOf } from './level-of.fixture';
import { sceneScript } from './scene-script.fixture';
import { slotOf } from './slot-of.fixture';
import { bossSpotEnemiesOf } from './boss-spot-enemies-of';
import { BOSS_RANDO_SPOTS } from './boss-spots.constants';
import { planBossSpotStats } from './plan-boss-spot-stats';
import { planBossSwapEdits } from './plan-boss-swap-edits';
import { rollBossAssignment } from './roll-boss-assignment';

const spots = BOSS_RANDO_SPOTS;
const rotated: BossAssignment = Object.fromEntries(spots.map((s, i) => [s.id, spots[(i + 1) % spots.length]?.id ?? s.id]));
const swapped: BossAssignment = { ...Object.fromEntries(spots.map((s) => [s.id, s.id])), yakra: 'heckran', heckran: 'yakra' };

const applied = (pack: Uint8Array, edits: readonly PackEdit[]): Uint8Array => {
  const out = pack.slice();
  edits.forEach((e) => {
    expect(pack[e.at]).toBe(e.old);
    out[e.at] = e.next;
  });
  return out;
};

const opOf = (pack: Uint8Array, scene: number): [number, number] => {
  const script = findSceneScript(pack, scene);
  return [pack[(script?.start ?? 0) + 34] ?? 0, pack[(script?.start ?? 0) + 35] ?? 0];
};

const expectSpotSwapped = (after: Uint8Array, spot: (typeof spots)[number], i: number): void => {
  const j = (i + 1) % spots.length;
  const expectedSlot = (slotOf(i) & 0x80) | (slotOf(j) & 0x7f);
  spot.scenes.forEach((scene) => expect(opOf(after, scene)).toEqual([spots[j]?.enemy, expectedSlot]));
};

describe('boss assignment', { tags: ['critical'] }, () => {
  it('is a permutation of the spots, the same for the same seed', () => {
    const a = rollBossAssignment('seed-a');
    expect(Object.keys(a).sort()).toEqual(spots.map((s) => s.id).sort());
    expect(Object.values(a).sort()).toEqual(spots.map((s) => s.id).sort());
    expect(rollBossAssignment('seed-a')).toEqual(a);
    expect(rollBossAssignment('seed-b')).not.toEqual(a);
  });

  it('exists only when the option is on', () => {
    expect(bossAssignmentOf({ bossRando: false }, 's')).toBeUndefined();
    expect(bossAssignmentOf({}, 's')).toBeUndefined();
    expect(bossAssignmentOf({ bossRando: true }, 's')).toEqual(rollBossAssignment('s'));
  });

  it('reaches the apply options only when on, and not without a seed', () => {
    expect(applyOptionsOf({}, [], 's').bossRando).toBeUndefined();
    expect(applyOptionsOf({ bossRando: true }, [], 's').bossRando).toEqual(rollBossAssignment('s'));
    expect(applyOptionsOf({ bossRando: true }, []).bossRando).toBeUndefined();
  });
});

describe('boss swap edits', { tags: ['critical'] }, () => {
  it('puts the moved boss in the spot, keeping the spot bit 7 and taking the boss own slot', () => {
    const pack = syntheticBossPack();
    const plan = planBossSwapEdits(pack, rotated);
    expect(plan.failed).toEqual([]);
    const after = applied(pack, plan.edits);
    spots.forEach((spot, i) => expectSpotSwapped(after, spot, i));
  });

  it('plans nothing for a boss left in place', () => {
    const identity = Object.fromEntries(spots.map((s) => [s.id, s.id]));
    expect(planBossSwapEdits(syntheticBossPack(), identity)).toEqual({ edits: [], failed: [] });
  });

  it('refuses when a spot enemy load is missing or not unique', () => {
    const yakraScene = spots[0]?.scenes[0] ?? 0;
    const twice = [...sceneScript(144, 3).slice(0, -1), 0x83, 144, 4, 0x00];
    const plan = planBossSwapEdits(syntheticBossPack({ [yakraScene]: twice }), rotated);
    expect(plan.edits).toEqual([]);
    expect(plan.failed).toEqual(['boss-rando: yakra enemy load not found']);
    expect(planBossSwapEdits(new Uint8Array(32), rotated).failed).toHaveLength(spots.length);
  });
});

describe('boss spot stats', { tags: ['critical'] }, () => {
  it('gives the moved boss the spot hp, level and rewards, and scales attack by the level ratio', () => {
    const pack = syntheticBossPack();
    const after = readEnemyStats(applied(pack, planBossSpotStats(pack, swapped)));
    const heckran = after[169]?.values;
    expect(heckran?.hp).toBe(hpOf(0));
    expect(heckran?.level).toBe(levelOf(0));
    expect(heckran?.xp).toBe(100);
    expect(heckran?.gold).toBe(50);
    expect(heckran?.tp).toBe(1);
    expect(heckran?.attack).toBe(Math.round(24 * (levelOf(0) / levelOf(1))));
    expect(after[144]?.values.hp).toBe(hpOf(1));
  });

  it('leaves everything alone when no boss moved', () => {
    const identity = Object.fromEntries(spots.map((s) => [s.id, s.id]));
    expect(planBossSpotStats(syntheticBossPack(), identity)).toEqual([]);
  });

  it('composes with depth scaling on the boss that stands at the check spot', () => {
    const pack = syntheticBossPack();
    const depths = new Map([['ki-taban', 5]]);
    const edits = planBossSpotStats(pack, swapped, depths);
    const after = readEnemyStats(applied(pack, edits));
    expect(after[144]?.values.hp).toBe(Math.round(hpOf(1) * 1.4));
    expect(after[169]?.values.hp).toBe(hpOf(0));
    expect(new Set(edits.map((e) => e.at)).size).toBe(edits.length);
  });

  it('follows the moved boss in the check spot map', () => {
    const map = bossSpotEnemiesOf(swapped);
    expect(map['ki-taban']).toEqual([144]);
    expect(map['ki-giants-claw']).toEqual([189]);
    expect(map['ki-kings-trial']).toEqual([199]);
  });
});

describe('boss spoiler rows', { tags: ['critical'] }, () => {
  it('lists the boss standing at each spot, and nothing when the option is off', () => {
    expect(bossRowsOf(undefined)).toEqual([]);
    const rows = bossRowsOf(swapped);
    expect(rows).toHaveLength(spots.length);
    expect(rows[0]).toEqual({ label: 'Boss at Yakra', value: 'Heckran' });
    expect(rows[1]).toEqual({ label: 'Boss at Heckran', value: 'Yakra' });
  });
});
