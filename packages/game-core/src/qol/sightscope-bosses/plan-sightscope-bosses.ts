/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../../randomizer/apply/apply-seed.type';
import { ENEMY_COUNT, STATS_RECORD_BYTES, STATS_ROM } from '../../randomizer/apply/enemy-table/enemy-table.constants';
import { packRomSpans } from '../../randomizer/apply/enemy-table/pack-rom-spans';
import type { QolPlanner } from '../qol.type';
import { BOSS_IDS, FLAGS_OFFSET, HIDE_HP_BIT } from './sightscope-bosses.constants';

const planSightscopeBosses: QolPlanner = (pack) => {
  const bases = packRomSpans(pack, STATS_ROM, ENEMY_COUNT * STATS_RECORD_BYTES);
  if (bases.length === 0) return { edits: [], failed: ['sightscopeBosses: enemy stats table not found in the pack'] };
  const edits: PackEdit[] = bases.flatMap((base) =>
    BOSS_IDS.flatMap((id) => {
      const at = base + id * STATS_RECORD_BYTES + FLAGS_OFFSET;
      const old = pack[at] ?? 0;
      return old & HIDE_HP_BIT ? [{ at, old, next: old & ~HIDE_HP_BIT, why: `sightscope-boss-${id}` }] : [];
    }),
  );
  return { edits, failed: [] };
};

export { planSightscopeBosses };
