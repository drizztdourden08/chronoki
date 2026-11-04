/* @layer bridge-wasm @kind test */
import type { CtPlacement } from './ct-placement.type';

const placementFixture = (locations: [string, string][], sphereCount = 0): CtPlacement => ({
  seed: 'abc',
  attempts: 1,
  locations,
  spheres: Array.from({ length: sphereCount }, (_, index) => ({ index, locations: [] })),
});

export { placementFixture };
