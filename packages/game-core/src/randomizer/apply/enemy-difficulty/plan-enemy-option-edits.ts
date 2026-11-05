/* @layer bridge-wasm @kind logic */
import type { ApplyOptions, PackEdit } from '../apply-seed.type';
import { planBossScalingEdits } from './plan-boss-scaling-edits';
import { planHardEnemyEdits } from './plan-hard-enemy-edits';

const planEnemyOptionEdits = (pack: Uint8Array, options: ApplyOptions): PackEdit[] => [
  ...(options.hardEnemies === true ? planHardEnemyEdits(pack) : []),
  ...(options.bossDepths === undefined ? [] : planBossScalingEdits(pack, options.bossDepths)),
];

export { planEnemyOptionEdits };
