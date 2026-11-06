/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ctPlayerFileOf, ctWidestChecks } from '@chronoki/game-core/archipelago';
import type { CtOptionValues, CtWorldInput } from '@chronoki/game-core';
import { parseApSpoiler, replayForward } from '@drizztdourden08/brock-randomizer/test-kit';
import { ctApworldRig } from './ct-apworld-rig';
import { ctReplayModelOf } from './ct-replay-model';

interface GoldenCase { name: string; seed: string; options: CtOptionValues }

const GOLDEN_CASES: readonly GoldenCase[] = [
  { name: 'standard', seed: 'golden-standard', options: { gameMode: 'standard' } },
  { name: 'standard-epoch-fail', seed: 'golden-epoch-fail', options: { gameMode: 'standard', epochFail: true } },
  { name: 'lost-worlds', seed: 'golden-lost-worlds', options: { gameMode: 'lost-worlds' } },
  { name: 'legacy-of-cyrus', seed: 'golden-legacy-of-cyrus', options: { gameMode: 'legacy-of-cyrus' } },
  { name: 'ice-age', seed: 'golden-ice-age', options: { gameMode: 'ice-age' } },
  { name: 'vanilla-rando', seed: 'golden-vanilla-rando', options: { gameMode: 'vanilla-rando' } },
];

const SEEDS_PER_CASE = 3;
const GENERATION_LIMIT_MS = 600_000;
const CASE_TIMEOUT_MS = SEEDS_PER_CASE * GENERATION_LIMIT_MS + 60_000;
const INSTALL_TIMEOUT_MS = 300_000;
const SLOT = 'Oracle';

const inputOf = ({ seed, options }: GoldenCase): CtWorldInput => ({ checks: ctWidestChecks(), options, fillerSeed: seed });

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

  for (const golden of GOLDEN_CASES) {
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
  }
});
