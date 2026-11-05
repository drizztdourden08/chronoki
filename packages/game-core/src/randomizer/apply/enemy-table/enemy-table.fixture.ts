/* @layer bridge-wasm @kind fixture */
import { ENEMY_COUNT, REWARDS_RECORD_BYTES, REWARDS_ROM, STATS_RECORD_BYTES, STATS_ROM } from './enemy-table.constants';

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const STAT_RECORD = [0x2c, 0x01, 10, 0, 0, 0, 0, 0, 5, 6, 7, 100, 9, 30, 20, 40, 4, 4, 4, 4, 0, 0, 0];
const REWARD_RECORD = [200, 0, 50, 0, 0, 0, 9];

const syntheticEnemyPack = (): Uint8Array => {
  const stats = new Array<number>(ENEMY_COUNT * STATS_RECORD_BYTES).fill(0);
  const rewards = new Array<number>(ENEMY_COUNT * REWARDS_RECORD_BYTES).fill(0);
  STAT_RECORD.forEach((b, i) => { stats[3 * STATS_RECORD_BYTES + i] = b; });
  REWARD_RECORD.forEach((b, i) => { rewards[3 * REWARDS_RECORD_BYTES + i] = b; });
  const tables = [{ id: STATS_ROM, data: stats }, { id: REWARDS_ROM, data: rewards }];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(tables.length)];
  let at = 12 + tables.length * 16;
  tables.forEach((t) => {
    bytes.push(...le32(37), ...le32(t.id), ...le32(at), ...le32(t.data.length));
    at += t.data.length;
  });
  tables.forEach((t) => bytes.push(...t.data));
  return Uint8Array.from(bytes);
};

export { syntheticEnemyPack };
