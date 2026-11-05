/* @layer bridge-wasm @kind logic */
import { applySeedToPack } from '../apply/apply-seed-to-pack';
import { applyOptionsOf } from '../apply/enemy-difficulty/apply-options-of';
import { planPackPlacement } from '../apply/plan-pack-placement';
import type { CtPlacement } from '../world/ct-placement.type';
import type { CtOptionValues } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';
import { rollCtPlacement } from '../world/roll-ct-placement';
import { comparePackToPlacement } from './readback/compare-pack-to-placement';
import { realignGiftChecks } from './readback/realign-gift-checks';
import { verifyCtPlacement } from './verify-ct-placement';
import { verifyRealInputOf } from './verify-real-input';
import type { VerifyResult } from './verify-result.type';
import { verifyStartSplicesOf } from './verify-start-splices';
import { startStateOf } from './verify-start-state-of';
import { VERIFY_SAMPLE } from './verify.constants';

const failedWith = (base: VerifyResult, error: string): VerifyResult => ({ ...base, ok: false, error });

const verifySeedEndToEnd = (pack: Uint8Array, options: CtOptionValues, party: CtStartParty, seed: string): VerifyResult => {
  const input = verifyRealInputOf(pack, options, party);
  const swept = verifyCtPlacement(input, seed);
  if (!swept.ok) return swept;
  try {
    const placement: CtPlacement = rollCtPlacement(input, seed);
    const placedParty = placement.startParty ?? party;
    const plan = planPackPlacement(placement, input.checks);
    const written = applySeedToPack(pack, plan.pack, verifyStartSplicesOf(options, placedParty), applyOptionsOf(options, placement.spheres));
    if (!written.ok) return failedWith(swept, `apply refused ${written.failed.length}: ${written.failed.slice(0, VERIFY_SAMPLE).join(', ')}`);
    const mismatches = comparePackToPlacement(written.bytes, placement, {
      checks: realignGiftChecks(pack, written.bytes, input.checks), startState: startStateOf(options), party: placedParty,
    });
    if (mismatches.length === 0) return swept;
    const sample = mismatches.slice(0, VERIFY_SAMPLE)
      .map((m) => `${m.kind} ${m.location} expected ${String(m.expected)} got ${String(m.actual)} at ${m.address}`).join('; ');
    return failedWith(swept, `readback ${mismatches.length} mismatches: ${sample}`);
  } catch (error) {
    return failedWith(swept, String(error));
  }
};

export { verifySeedEndToEnd };
