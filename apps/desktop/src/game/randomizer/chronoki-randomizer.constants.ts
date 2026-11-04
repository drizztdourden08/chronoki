/* @layer bridge-wasm @kind constants */
import type { RandomizerLabels } from '@drizztdourden08/brock-randomizer';
import type { ApplyResult } from '@drizztdourden08/brock-randomizer/session';

const RANDOMIZER_GATE = 'randomizer';
const LOCAL_MODE = 'local';
const SEED_DIGITS = 8;
const SEED_RADIX = 36;
const REFUSED_SAMPLE = 3;
const REFUSAL_TOAST_MS = 8000;

const CHRONOKI_RANDOMIZER_LABELS: Partial<RandomizerLabels> = {
  title: 'Randomizer',
  checks: 'Checks',
  modes: { local: 'Local (offline)' },
};

const BOOT_REFUSALS = {
  gateOff: 'This is a randomizer profile. Turn on Randomizer in Settings > Gameplay to play it.',
  notLocal: 'Online randomizer play is not available yet.',
  noChecks: 'The game pack has no checks the randomizer can read.',
  noPlacement: 'This profile has no seed to play.',
} as const;

const NOT_APPLIED_REFUSAL = 'the seed was not written to the game pack at boot';
const NOT_APPLIED_RESULT: ApplyResult<unknown> = { ok: false, refusal: NOT_APPLIED_REFUSAL };
const NO_CHECKS_ROLL = 'the checks are not loaded: pick the ROM again and retry';

export {
  BOOT_REFUSALS, CHRONOKI_RANDOMIZER_LABELS, LOCAL_MODE, NOT_APPLIED_REFUSAL, NOT_APPLIED_RESULT, NO_CHECKS_ROLL, RANDOMIZER_GATE,
  REFUSAL_TOAST_MS, REFUSED_SAMPLE, SEED_DIGITS, SEED_RADIX,
};
