/* @layer bridge-wasm @kind logic */
import { BOSS_SPOTS } from './boss-map.constants';
import type { SphereLike } from './enemy-difficulty.type';

const bossDepthsOf = (spheres: readonly SphereLike[]): ReadonlyMap<string, number> => {
  const depths = new Map<string, number>();
  spheres.forEach((sphere, depth) =>
    sphere.locations.forEach((location) => {
      const key = String(location);
      if (BOSS_SPOTS.includes(key) && !depths.has(key)) depths.set(key, depth);
    }));
  return depths;
};

export { bossDepthsOf };
