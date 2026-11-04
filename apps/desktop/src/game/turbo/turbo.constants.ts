/* @layer bridge-wasm @kind constants */
const TURBO_SPEEDS: readonly number[] = [1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 7.5, 10];

const TURBO_DEFAULT_SPEED = 2;

const TURBO_MIN_SPEED = 1.25;

const TURBO_MAX_SPEED = 10;

const TURBO_GATE = 'turbo';

export { TURBO_DEFAULT_SPEED, TURBO_GATE, TURBO_MAX_SPEED, TURBO_MIN_SPEED, TURBO_SPEEDS };
