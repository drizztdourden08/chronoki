/* @layer bridge-wasm @kind logic */
import { SEED_DIGITS, SEED_RADIX } from './chronoki-randomizer.constants';

const randomSeed = (): string =>
  Array.from({ length: SEED_DIGITS }, () => Math.floor(Math.random() * SEED_RADIX).toString(SEED_RADIX)).join('');

export { randomSeed };
