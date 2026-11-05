/* @layer bridge-wasm @kind constants */
const SHOP_PRICE_STREAM = ':shop-prices';
const PRICED_CLASSES: ReadonlySet<number> = new Set([0, 1, 2, 4]);
const MOSTLY_MIN_FACTOR = 0.5;
const MOSTLY_SPAN = 1;
const FULLY_MIN_PRICE = 10;
const FULLY_MAX_PRICE = 30000;
const PRICE_MAX = 0xffff;
const ROUND_ABOVE = 100;
const ROUND_STEP = 10;
const PRICE_BYTES = 2;

export {
  FULLY_MAX_PRICE, FULLY_MIN_PRICE, MOSTLY_MIN_FACTOR, MOSTLY_SPAN, PRICE_BYTES, PRICE_MAX, PRICED_CLASSES, ROUND_ABOVE, ROUND_STEP,
  SHOP_PRICE_STREAM,
};
