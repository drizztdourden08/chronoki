/* @layer bridge-wasm @kind constants */
type MysteryWeights = Readonly<Record<string, number>>;

const MYSTERY_GAME_MODE: MysteryWeights = { standard: 6, 'lost-worlds': 1, 'legacy-of-cyrus': 1, 'ice-age': 1, 'vanilla-rando': 1 };
const MYSTERY_ITEM_DIFFICULTY: MysteryWeights = { easy: 2, normal: 4, hard: 2 };
const MYSTERY_ENEMY_DIFFICULTY: MysteryWeights = { normal: 3, hard: 1 };
const MYSTERY_SHOP_PRICES: MysteryWeights = { normal: 4, free: 1, 'mostly-random': 2, 'fully-random': 1 };
const MYSTERY_TECH_ORDER: MysteryWeights = { normal: 3, 'balanced-random': 2, 'full-random': 1 };
const MYSTERY_STREAM = ':mystery';

export {
  MYSTERY_ENEMY_DIFFICULTY, MYSTERY_GAME_MODE, MYSTERY_ITEM_DIFFICULTY, MYSTERY_SHOP_PRICES, MYSTERY_STREAM, MYSTERY_TECH_ORDER,
};
