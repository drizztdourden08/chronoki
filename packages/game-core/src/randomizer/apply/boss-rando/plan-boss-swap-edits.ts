/* @layer bridge-wasm @kind logic */
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { SLOT_KEEP_BIT, SLOT_MASK } from './boss-rando.constants';
import type { BossAssignment, BossOp, BossSpot } from './boss-rando.type';
import { BOSS_RANDO_SPOTS } from './boss-spots.constants';
import { findBossOps } from './find-boss-ops';

const spotEdits = (spot: BossSpot, ops: readonly BossOp[], source: BossSpot, sourceOp: BossOp): PackEdit[] =>
  ops.flatMap((op): PackEdit[] => {
    const why = `boss-rando-${spot.id}`;
    const slot = (op.slot & SLOT_KEEP_BIT) | (sourceOp.slot & SLOT_MASK);
    return [
      ...(op.enemy === source.enemy ? [] : [{ at: op.at, old: op.enemy, next: source.enemy, why: `${why}-enemy` }]),
      ...(op.slot === slot ? [] : [{ at: op.at + 1, old: op.slot, next: slot, why: `${why}-slot` }]),
    ];
  });

const planBossSwapEdits = (pack: Uint8Array, assignment: BossAssignment): EditPlan => {
  const found = BOSS_RANDO_SPOTS.map((spot) => ({ spot, ops: findBossOps(pack, spot) }));
  const missing = found.filter((f) => f.ops === null).map((f) => `boss-rando: ${f.spot.id} enemy load not found`);
  if (missing.length > 0) return { edits: [], failed: missing };
  const opsOf = new Map(found.map((f) => [f.spot.id, f.ops ?? []]));
  const spotOf = new Map(BOSS_RANDO_SPOTS.map((s) => [s.id, s]));
  const edits = BOSS_RANDO_SPOTS.flatMap((spot) => {
    const source = spotOf.get(assignment[spot.id] ?? spot.id);
    const sourceOp = opsOf.get(source?.id ?? '')?.[0];
    return source && sourceOp && source !== spot ? spotEdits(spot, opsOf.get(spot.id) ?? [], source, sourceOp) : [];
  });
  return { edits, failed: [] };
};

export { planBossSwapEdits };
