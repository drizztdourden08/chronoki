/* @layer bridge-wasm @kind logic */
import { turboConfig } from './turbo-config';
import { TURBO_MAX_SPEED, TURBO_MIN_SPEED } from './turbo.constants';

const setTurboSpeed = (speed: number): void => {
  turboConfig.speed = Math.max(TURBO_MIN_SPEED, Math.min(TURBO_MAX_SPEED, Math.round(speed)));
};

export { setTurboSpeed };
