/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../../randomizer/apply/apply-seed.type';
import { BOSS_SPOT_ENEMIES } from '../../randomizer/apply/enemy-difficulty/boss-map.constants';
import { ENEMY_COUNT, STATS_RECORD_BYTES, STATS_ROM } from '../../randomizer/apply/enemy-table/enemy-table.constants';
import { packRomSpans } from '../../randomizer/apply/enemy-table/pack-rom-spans';
import type { QolPlanner } from '../qol.type';

// stats record byte 21 is the enemy block's +0x1A (battle boot copies record +20..22 to block +0x19..1B); the boot
// derives the SightScope HP bit as (+0x1A & 0x02) ^ 0x02, so a boss with the bit set shows no HP. Clearing it shows HP.
const FLAGS_OFFSET = 21;
const HIDE_HP_BIT = 0x02;
const BOSS_IDS: readonly number[] = [...new Set(Object.values(BOSS_SPOT_ENEMIES).flat())];

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
