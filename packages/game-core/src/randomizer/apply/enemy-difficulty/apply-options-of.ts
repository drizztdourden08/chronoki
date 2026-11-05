/* @layer bridge-wasm @kind logic */
import { spotGiftsOf } from '../../checks/spot-gifts-of';
import { tabAmountsOf } from '../../world/tabs/tab-amounts-of';
import type { ItemDifficulty } from '../../world/treasure-tiers/treasure-tier.type';
import type { ApplyOptions } from '../apply-seed.type';
import { shopPriceOptionOf } from '../shop-prices/shop-price-option-of';
import { bossDepthsOf } from './boss-depths-of';
import type { OptionBag, SphereLike } from './enemy-difficulty.type';

const applyOptionsOf = (options: OptionBag, spheres: readonly SphereLike[], seed?: string): ApplyOptions => {
  const shopPrices = shopPriceOptionOf(options, seed ?? '');
  const spotGifts = spotGiftsOf(options).map((gift) => gift.spot);
  const tabAmounts = seed === undefined ? null : tabAmountsOf(options, seed);
  return {
    ...(spotGifts.length === 0 ? {} : { spotGifts }),
    difficulty: (options.itemDifficulty ?? 'normal') as ItemDifficulty,
    ...(options.enemyDifficulty === 'hard' ? { hardEnemies: true } : {}),
    ...(options.epochFail === true && options.gameMode !== 'lost-worlds' ? { epochFail: true } : {}),
    ...(options.bossScaling === true ? { bossDepths: bossDepthsOf(spheres) } : {}),
    ...(shopPrices === undefined ? {} : { shopPrices }),
    ...(tabAmounts === null ? {} : { tabAmounts }),
  };
};

export { applyOptionsOf };
