/* @layer bridge-wasm @kind constants */
import { spotGiftsOf } from '../../checks/spot-gifts-of';
import { characterAssignmentOf } from '../../world/recruits/character-assignment-of';
import { tabAmountsOf } from '../../world/tabs/tab-amounts-of';
import type { ItemDifficulty } from '../../world/treasure-tiers/treasure-tier.type';
import { bossAssignmentOf } from '../boss-rando/boss-assignment-of';
import { elementAssignmentOf } from '../element-rando/element-assignment-of';
import { shopPriceOptionOf } from '../shop-prices/shop-price-option-of';
import type { TechOrderMode } from '../tech-order/tech-order.type';
import type { ApplyOptionMapper } from './apply-option-mapper.type';
import { SEEDED_OPTIONS, TECH_ORDER_MODES } from './apply-options-of.constants';
import { bossDepthsOf } from './boss-depths-of';

const APPLY_OPTION_MAPPERS: readonly ApplyOptionMapper[] = [
  ({ options }) => {
    const spotGifts = spotGiftsOf(options).map((gift) => gift.spot);
    return spotGifts.length === 0 ? {} : { spotGifts };
  },
  ({ options }) => ({ difficulty: (options.itemDifficulty ?? 'normal') as ItemDifficulty }),
  ({ options }) => (options.enemyDifficulty === 'hard' ? { hardEnemies: true } : {}),
  ({ options }) => (options.epochFail === true && options.gameMode !== 'lost-worlds' ? { epochFail: true } : {}),
  ({ options, spheres }) => (options.bossScaling === true ? { bossDepths: bossDepthsOf(spheres) } : {}),
  ({ options, seed }) => {
    const shopPrices = shopPriceOptionOf(options, seed ?? '');
    return shopPrices === undefined ? {} : { shopPrices };
  },
  ({ options, seed }) => {
    const tabAmounts = seed === undefined ? null : tabAmountsOf(options, seed);
    return tabAmounts === null ? {} : { tabAmounts };
  },
  ({ options }) => (TECH_ORDER_MODES.includes(String(options.techOrder)) ? { techOrder: options.techOrder as TechOrderMode } : {}),
  ({ options }) => (options.gearRando === true ? { gearRando: true } : {}),
  ({ options }) => (options.healingRando === true ? { healingRando: true } : {}),
  ({ options }) => (options.techDamageRando === true ? { techDamageRando: true } : {}),
  ({ options, seed }) => {
    const elementRando = seed === undefined ? undefined : elementAssignmentOf(options, seed);
    return elementRando === undefined ? {} : { elementRando };
  },
  ({ options, seed }) =>
    SEEDED_OPTIONS.some((key) => options[key] === true || TECH_ORDER_MODES.includes(String(options[key]))) ? { seed: seed ?? '' } : {},
  ({ options, seed }) => {
    const bossRando = seed === undefined ? undefined : bossAssignmentOf(options, seed);
    return bossRando === undefined ? {} : { bossRando };
  },
  ({ options, seed }) => {
    const characterRando = seed === undefined ? undefined : characterAssignmentOf(options, seed);
    return characterRando === undefined ? {} : { characterRando };
  },
];

export { APPLY_OPTION_MAPPERS };
