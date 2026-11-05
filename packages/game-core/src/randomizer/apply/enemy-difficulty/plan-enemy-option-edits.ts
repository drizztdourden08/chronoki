/* @layer bridge-wasm @kind logic */
import type { ApplyOptions, PackEdit } from '../apply-seed.type';
import { planBossSpotStats } from '../boss-rando/plan-boss-spot-stats';
import { planBossScalingEdits } from './plan-boss-scaling-edits';
import { planHardEnemyEdits } from './plan-hard-enemy-edits';

const bossStatEdits = (pack: Uint8Array, options: ApplyOptions): PackEdit[] => {
  if (options.bossRando !== undefined) return planBossSpotStats(pack, options.bossRando, options.bossDepths);
  return options.bossDepths === undefined ? [] : planBossScalingEdits(pack, options.bossDepths);
};

const planEnemyOptionEdits = (pack: Uint8Array, options: ApplyOptions): PackEdit[] => [
  ...(options.hardEnemies === true ? planHardEnemyEdits(pack) : []),
  ...bossStatEdits(pack, options),
];

export { planEnemyOptionEdits };
