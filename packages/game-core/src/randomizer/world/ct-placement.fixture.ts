/* @layer bridge-wasm @kind test */
import type { CtPlacement } from './ct-placement.type';
import type { CtItem } from './ct-world-keys.type';

const placementFixture = (locations: [string, CtItem][], sphereCount = 0): CtPlacement => ({
  seed: 'abc',
  attempts: 1,
  locations,
  spheres: Array.from({ length: sphereCount }, (_, index) => ({ index, locations: [] })),
});

export { placementFixture };
