/* @layer bridge-wasm @kind type */
type ShopPriceMode = 'free' | 'mostly-random' | 'fully-random';

type ShopPriceOption = { mode: ShopPriceMode; seed: string };

type PriceSlot = { id: number; price: number; at: readonly number[] };

export type { PriceSlot, ShopPriceMode, ShopPriceOption };
