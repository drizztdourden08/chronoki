/* @layer bridge-wasm @kind logic */
import {
  FULLY_MAX_PRICE, FULLY_MIN_PRICE, MOSTLY_MIN_FACTOR, MOSTLY_SPAN, PRICE_MAX, ROUND_ABOVE, ROUND_STEP,
} from './shop-prices.constants';
import type { ShopPriceMode } from './shop-prices.type';

const tidy = (price: number): number => {
  const rounded = price >= ROUND_ABOVE ? Math.round(price / ROUND_STEP) * ROUND_STEP : Math.round(price);
  return Math.min(PRICE_MAX, Math.max(1, rounded));
};

const fullyRandom = (roll: number): number =>
  Math.exp(Math.log(FULLY_MIN_PRICE) + roll * (Math.log(FULLY_MAX_PRICE) - Math.log(FULLY_MIN_PRICE)));

const priceOf = (mode: ShopPriceMode, old: number, roll: number): number => {
  if (mode === 'free') return 0;
  return tidy(mode === 'mostly-random' ? old * (MOSTLY_MIN_FACTOR + roll * MOSTLY_SPAN) : fullyRandom(roll));
};

export { priceOf };
