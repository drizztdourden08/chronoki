/* @layer bridge-wasm @kind logic */
import { TURBO_DEFAULT_SPEED, TURBO_SPEEDS } from './turbo.constants';

const nearestTurboSpeed = (speed: number): number => {
  let best = TURBO_DEFAULT_SPEED;
  let bestGap = Infinity;
  for (const candidate of TURBO_SPEEDS) {
    const gap = Math.abs(candidate - speed);
    if (gap < bestGap) {
      best = candidate;
      bestGap = gap;
    }
  }
  return best;
};

export { nearestTurboSpeed };
