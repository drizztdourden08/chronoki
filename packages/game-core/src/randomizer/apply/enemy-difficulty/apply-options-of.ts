/* @layer bridge-wasm @kind logic */
import { spotGiftsOf } from '../../checks/spot-gifts-of';
import { tabAmountsOf } from '../../world/tabs/tab-amounts-of';
import type { ItemDifficulty } from '../../world/treasure-tiers/treasure-tier.type';
import type { ApplyOptions } from '../apply-seed.type';
import { characterAssignmentOf } from '../../world/recruits/character-assignment-of';
import { bossAssignmentOf } from '../boss-rando/boss-assignment-of';
import { elementAssignmentOf } from '../element-rando/element-assignment-of';
import { shopPriceOptionOf } from '../shop-prices/shop-price-option-of';
import type { TechOrderMode } from '../tech-order/tech-order.type';
import { bossDepthsOf } from './boss-depths-of';
import type { OptionBag, SphereLike } from './enemy-difficulty.type';

const TECH_ORDER_MODES: readonly string[] = ['balanced-random', 'full-random'];

const SEEDED_OPTIONS: readonly string[] = ['techOrder', 'gearRando', 'healingRando', 'techDamageRando', 'elementRando'];

const applyOptionsOf = (options: OptionBag, spheres: readonly SphereLike[], seed?: string): ApplyOptions => {
  const shopPrices = shopPriceOptionOf(options, seed ?? '');
  const spotGifts = spotGiftsOf(options).map((gift) => gift.spot);
  const tabAmounts = seed === undefined ? null : tabAmountsOf(options, seed);
  const bossRando = seed === undefined ? undefined : bossAssignmentOf(options, seed);
  const characterRando = seed === undefined ? undefined : characterAssignmentOf(options, seed);
  const elementRando = seed === undefined ? undefined : elementAssignmentOf(options, seed);
  return {
    ...(spotGifts.length === 0 ? {} : { spotGifts }),
    difficulty: (options.itemDifficulty ?? 'normal') as ItemDifficulty,
    ...(options.enemyDifficulty === 'hard' ? { hardEnemies: true } : {}),
    ...(options.epochFail === true && options.gameMode !== 'lost-worlds' ? { epochFail: true } : {}),
    ...(options.bossScaling === true ? { bossDepths: bossDepthsOf(spheres) } : {}),
    ...(shopPrices === undefined ? {} : { shopPrices }),
    ...(tabAmounts === null ? {} : { tabAmounts }),
    ...(TECH_ORDER_MODES.includes(String(options.techOrder)) ? { techOrder: options.techOrder as TechOrderMode } : {}),
    ...(options.gearRando === true ? { gearRando: true } : {}),
    ...(options.healingRando === true ? { healingRando: true } : {}),
    ...(options.techDamageRando === true ? { techDamageRando: true } : {}),
    ...(elementRando === undefined ? {} : { elementRando }),
    ...(SEEDED_OPTIONS.some((key) => options[key] === true || TECH_ORDER_MODES.includes(String(options[key]))) ? { seed: seed ?? '' } : {}),
    ...(bossRando === undefined ? {} : { bossRando }),
    ...(characterRando === undefined ? {} : { characterRando }),
  };
};

export { applyOptionsOf };
