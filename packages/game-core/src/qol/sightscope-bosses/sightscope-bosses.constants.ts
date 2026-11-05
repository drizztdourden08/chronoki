/* @layer bridge-wasm @kind constants */
import { BOSS_SPOT_ENEMIES } from '../../randomizer/apply/enemy-difficulty/boss-map.constants';

const FLAGS_OFFSET = 21;
const HIDE_HP_BIT = 0x02;
const BOSS_IDS: readonly number[] = [...new Set(Object.values(BOSS_SPOT_ENEMIES).flat())];

export { BOSS_IDS, FLAGS_OFFSET, HIDE_HP_BIT };
