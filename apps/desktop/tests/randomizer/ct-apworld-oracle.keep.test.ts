/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ctPlayerFileOf, ctWidestChecks } from '@chronoki/game-core/archipelago';
import type { CtWorldInput } from '@chronoki/game-core';
import { parseApSpoiler, replayForward } from '@drizztdourden08/brock-randomizer/test-kit';
import { ctApworldRig } from './ct-apworld-rig';
import { CT_ORACLE_EXTRA_CASES, CT_SHAPE_CASES } from './ct-apworld-shape.cases';
import type { CtShapeCase } from './ct-apworld-shape.cases';
import { ctReplayModelOf } from './ct-replay-model';

const SEEDS_PER_CASE = 3;
const GENERATION_LIMIT_MS = 600_000;
const CASE_TIMEOUT_MS = SEEDS_PER_CASE * GENERATION_LIMIT_MS + 60_000;
const INSTALL_TIMEOUT_MS = 300_000;
const SLOT = 'Oracle';

const inputOf = ({ seed, options }: CtShapeCase): CtWorldInput => ({ checks: ctWidestChecks(), options, fillerSeed: seed });

const rig = ctApworldRig;
const describeAp = rig.supportsInstalledVersion() ? describe : describe.skip;

const skipReason = !rig.hasArchipelago()
  ? 'ArchipelagoGenerate.exe not found'
  : `Archipelago ${rig.installedVersion()} is not in SUPPORTED_AP_VERSIONS`;
if (!rig.supportsInstalledVersion()) {
  process.stderr.write(`apworld oracle: ${skipReason}, the generator half is skipped\n`);
  describe('the world package against Archipelago', { tags: ['e2e'] }, () => {
    it.skip(`skipped: ${skipReason}`, () => undefined);
  });
}

describeAp('the world package against Archipelago', { tags: ['e2e'] }, () => {
  it('installs the built package', () => {
    console.log(`apworld oracle: ${rig.installWorldPackage()}`);
  }, INSTALL_TIMEOUT_MS);

  const caseTest = (golden: CtShapeCase) => {
    it(`generates ${SEEDS_PER_CASE} ${golden.name} seeds whose spoiler reaches the goal`, async () => {
      const yaml = ctPlayerFileOf({ slotName: SLOT, world: inputOf(golden), seedText: golden.seed }).yaml;
      for (let seed = 1; seed <= SEEDS_PER_CASE; seed += 1) {
        const run = await rig.generate(yaml, seed);
        expect(run.ok && run.spoiler !== null, run.log.slice(-2000)).toBe(true);
        const verdict = replayForward(ctReplayModelOf(inputOf(golden), golden.seed), parseApSpoiler(run.spoiler ?? ''));
        expect(verdict.unknown, `${golden.name} seed ${seed}`).toEqual([]);
        expect(verdict.sphereMisses, `${golden.name} seed ${seed}`).toEqual([]);
        expect(verdict.beaten, `${golden.name} seed ${seed}`).toBe(true);
      }
    }, CASE_TIMEOUT_MS);
  };

  for (const golden of CT_SHAPE_CASES) caseTest(golden);

  for (const extra of CT_ORACLE_EXTRA_CASES) caseTest(extra);
});
