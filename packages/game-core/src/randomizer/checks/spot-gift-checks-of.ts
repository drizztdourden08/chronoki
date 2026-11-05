/* @layer bridge-wasm @kind logic */
import type { CheckDef } from './check.type';
import { spotGiftsOf } from './spot-gifts-of';

const spotGiftChecksOf = (options: Readonly<Record<string, unknown>> | undefined): CheckDef[] =>
  spotGiftsOf(options).map((gift): CheckDef => ({ id: gift.spot, kind: 'gift', locationId: gift.scene, vanillaItem: 0 }));

export { spotGiftChecksOf };
