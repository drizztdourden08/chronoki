/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { planBossScalingEdits } from '../enemy-difficulty/plan-boss-scaling-edits';
import { overlayEnemyStats } from '../enemy-table/overlay-enemy-stats';
import { planEnemySet } from '../enemy-table/plan-enemy-set';
import { readEnemyStats } from '../enemy-table/read-enemy-stats';
import { mergePackEdits } from '../merge-pack-edits';
import { bossSpotEnemiesOf } from './boss-spot-enemies-of';
import { bossSpotTargets } from './boss-spot-targets';
import type { BossAssignment } from './boss-rando.type';

const planBossSpotStats = (
  pack: Uint8Array,
  assignment: BossAssignment,
  depths?: ReadonlyMap<string, number>,
): PackEdit[] => {
  const stats = readEnemyStats(pack);
  const targets = bossSpotTargets(stats, assignment);
  const spotEdits = planEnemySet(stats, targets);
  if (depths === undefined) return spotEdits;
  const scaled = planBossScalingEdits(pack, depths, bossSpotEnemiesOf(assignment), overlayEnemyStats(stats, targets));
  return mergePackEdits(spotEdits, scaled);
};

export { planBossSpotStats };
