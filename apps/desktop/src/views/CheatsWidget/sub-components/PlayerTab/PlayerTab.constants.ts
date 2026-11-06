/* @layer renderer-widgets @kind constants */
import type { SheetStat } from '@chronoki/game-core';

const GOLD_CAP = 9999999;
const GOLD_STEPS = [100, 10000] as const;
const STAT_STEPS = [1, 10] as const;
const STAT_LABELS: Readonly<Record<SheetStat, string>> = { hp: 'HP', mp: 'MP', maxHp: 'Max HP', maxMp: 'Max MP' };
const STAT_ORDER: readonly SheetStat[] = ['hp', 'maxHp', 'mp', 'maxMp'];

export { GOLD_CAP, GOLD_STEPS, STAT_LABELS, STAT_ORDER, STAT_STEPS };
