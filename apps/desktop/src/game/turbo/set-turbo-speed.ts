/* @layer bridge-wasm @kind logic */
import { nearestTurboSpeed } from './nearest-turbo-speed';
import { turboConfig } from './turbo-config';

const setTurboSpeed = (speed: number): void => {
  turboConfig.speed = nearestTurboSpeed(speed);
};

export { setTurboSpeed };
