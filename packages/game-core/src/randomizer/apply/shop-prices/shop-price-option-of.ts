/* @layer bridge-wasm @kind logic */
import type { OptionBag } from '../enemy-difficulty/enemy-difficulty.type';
import type { ShopPriceOption } from './shop-prices.type';

const shopPriceOptionOf = (options: OptionBag, seed: string): ShopPriceOption | undefined => {
  const mode = options.shopPrices;
  return mode === 'free' || mode === 'mostly-random' || mode === 'fully-random' ? { mode, seed } : undefined;
};

export { shopPriceOptionOf };
