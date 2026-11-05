/* @layer bridge-wasm @kind constants */
import type { GoldenCase } from './golden-seeds.type';

const GOLDEN_CASES: readonly GoldenCase[] = [
  { name: 'standard', seed: 'golden-standard', options: { gameMode: 'standard' } },
  { name: 'standard-epoch-fail', seed: 'golden-epoch-fail', options: { gameMode: 'standard', epochFail: true } },
  { name: 'lost-worlds', seed: 'golden-lost-worlds', options: { gameMode: 'lost-worlds' } },
  { name: 'legacy-of-cyrus', seed: 'golden-legacy-of-cyrus', options: { gameMode: 'legacy-of-cyrus' } },
  { name: 'ice-age', seed: 'golden-ice-age', options: { gameMode: 'ice-age' } },
  { name: 'vanilla-rando', seed: 'golden-vanilla-rando', options: { gameMode: 'vanilla-rando' } },
];

export { GOLDEN_CASES };
