/* @layer bridge-wasm @kind constants */
import type { EnemyField } from '../enemy-table/enemy-table.type';

const BOSS_SPOT_FIELDS: readonly EnemyField[] = ['hp', 'level', 'xp', 'gold', 'tp'];
const BOSS_RATIO_FIELDS: readonly EnemyField[] = ['attack', 'magic', 'defense'];

export { BOSS_RATIO_FIELDS, BOSS_SPOT_FIELDS };
