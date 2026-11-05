/* @layer bridge-wasm @kind constants */
import { WRAM_BANK_7F } from '../../game-info/wram-map.constants';
import type { GoalBit } from './goal-watch.type';

const LEGACY_OF_CYRUS_GOAL: GoalBit = { at: WRAM_BANK_7F + 0x01a1, mask: 0x80, edge: false };
const ICE_AGE_GOAL: GoalBit = { at: WRAM_BANK_7F + 0x01a0, mask: 0x10, edge: true };

export { ICE_AGE_GOAL, LEGACY_OF_CYRUS_GOAL };
