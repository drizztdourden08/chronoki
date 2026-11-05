/* @layer bridge-wasm @kind constants */
import type { RandomizerLabels } from '@drizztdourden08/brock-randomizer';
import type { ApplyResult } from '@drizztdourden08/brock-randomizer/session';

const LOCAL_MODE = 'local';
const REFUSED_SAMPLE = 3;
const REFUSAL_TOAST_MS = 8000;

const CHRONOKI_RANDOMIZER_LABELS: Partial<RandomizerLabels> = {
  title: 'Randomizer',
  checks: 'Checks',
  modes: { local: 'Local (offline)' },
};

const BOOT_REFUSALS = {
  notLocal: 'Online randomizer play is not available yet.',
  noChecks: 'The game pack has no checks the randomizer can read.',
  noPlacement: 'This profile has no seed to play.',
} as const;

const START_MISMATCH_TOAST = 'The randomizer start did not apply: this run is not the seed you rolled. See the Randomizer log.';

const NOT_APPLIED_REFUSAL = 'the seed was not written to the game pack at boot';
const NOT_APPLIED_RESULT: ApplyResult<unknown> = { ok: false, refusal: NOT_APPLIED_REFUSAL };
const NO_CHECKS_ROLL = 'the game pack has no checks the randomizer can read';
const NO_PACK_ROLL = 'The game pack for this ROM is missing, so no seed can be rolled. Open the ROM once, then try again.';

export {
  BOOT_REFUSALS, CHRONOKI_RANDOMIZER_LABELS, LOCAL_MODE, NOT_APPLIED_REFUSAL, NOT_APPLIED_RESULT, NO_CHECKS_ROLL, NO_PACK_ROLL,
  REFUSAL_TOAST_MS, REFUSED_SAMPLE, START_MISMATCH_TOAST,
};
