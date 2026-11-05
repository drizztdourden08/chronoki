/* @layer bridge-wasm @kind logic */
import {
  ENEMY_COUNT, ENEMY_FIELD_SPECS, REWARDS_RECORD_BYTES, REWARDS_ROM, STATS_RECORD_BYTES, STATS_ROM,
} from './enemy-table.constants';
import type { EnemyField, EnemyStats } from './enemy-table.type';
import { packRomSpans } from './pack-rom-spans';

const readField = (pack: Uint8Array, at: number, bytes: number): number =>
  bytes === 2 ? (pack[at] ?? 0) | ((pack[at + 1] ?? 0) << 8) : (pack[at] ?? 0);

const readEnemyStats = (pack: Uint8Array): EnemyStats[] => {
  const statsBase = packRomSpans(pack, STATS_ROM, ENEMY_COUNT * STATS_RECORD_BYTES);
  const rewardsBase = packRomSpans(pack, REWARDS_ROM, ENEMY_COUNT * REWARDS_RECORD_BYTES);
  const first = statsBase[0];
  const firstReward = rewardsBase[0];
  if (first === undefined || firstReward === undefined) return [];
  const names = Object.keys(ENEMY_FIELD_SPECS) as EnemyField[];
  return Array.from({ length: ENEMY_COUNT }, (_, id) => {
    const values = Object.fromEntries(
      names.map((name) => {
        const spec = ENEMY_FIELD_SPECS[name];
        const record = spec.table === 'stats' ? first + id * STATS_RECORD_BYTES : firstReward + id * REWARDS_RECORD_BYTES;
        return [name, readField(pack, record + spec.offset, spec.bytes)];
      }),
    ) as Record<EnemyField, number>;
    return {
      id,
      values,
      statsAt: statsBase.map((b) => b + id * STATS_RECORD_BYTES),
      rewardsAt: rewardsBase.map((b) => b + id * REWARDS_RECORD_BYTES),
    };
  });
};

export { readEnemyStats };
