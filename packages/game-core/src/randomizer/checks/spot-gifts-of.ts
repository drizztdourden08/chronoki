/* @layer bridge-wasm @kind logic */
import type { SpotGift } from './spot-gift.type';
import { SPOT_GIFTS } from './spot-gifts.constants';

const spotGiftsOf = (options: Readonly<Record<string, unknown>> | undefined): SpotGift[] =>
  SPOT_GIFTS.filter((gift) => options?.[gift.option] === true);

export { spotGiftsOf };
