/* @layer bridge-wasm @kind logic */
import { applySeedToPack } from '../../apply/apply-seed-to-pack';
import { applyOptionsOf } from '../../apply/enemy-difficulty/apply-options-of';
import { planPackPlacement } from '../../apply/plan-pack-placement';
import type { CtOptionValues } from '../../world/ct-world-input.type';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { partyIdsOf } from '../../world/party/party-ids-of';
import { rollCtPlacement } from '../../world/roll-ct-placement';
import type { PreparedSeed } from './prepare-seed-pack.type';
import { verifyRealInputOf } from '../verify-real-input';
import { planSeedSplices } from '../../apply/plan-seed-splices';
import { startStateOf } from '../verify-start-state-of';

const prepareSeedPack = (pack: Uint8Array, options: CtOptionValues, party: CtStartParty, seed: string): PreparedSeed => {
  const input = verifyRealInputOf(pack, options, party);
  const placement = rollCtPlacement(input, seed);
  const placed = placement.startParty ?? party;
  const plan = planPackPlacement(placement, input.checks);
  const written = applySeedToPack(pack, plan.pack, planSeedSplices(options, placed), applyOptionsOf(options, placement.spheres, seed));
  if (!written.ok) throw new Error(`apply refused ${written.failed.length}: ${written.failed.slice(0, 5).join(', ')}`);
  return { bytes: written.bytes, party: placed, partyIds: partyIdsOf(placed), flags: startStateOf(options).flags };
};

export { prepareSeedPack };
