/* @layer bridge-wasm @kind constants */
import { SPOT_GIFTS } from './spot-gifts.constants';

const SPOT_GIFT_IDS: ReadonlySet<string> = new Set(SPOT_GIFTS.map((gift) => gift.spot));

export { SPOT_GIFT_IDS };
