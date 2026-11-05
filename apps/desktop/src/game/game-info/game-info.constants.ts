/* @layer bridge-wasm @kind constants */
const GAME_INFO_FEATURE = 'gameInfo';
const GAME_INFO_EMPTY_TEXT = 'Start the game to see its details here.';
const MAP_ID_WIDTH = 3;
const CLOCK_PAD = 2;
const LIVE_STATUSES: readonly string[] = ['running', 'paused'];
const KEY_ITEM_FIRST_ID = 0xd6;
const TECH_FIRST_ID = 1;
const TECH_PER_CHARACTER = 8;
const FILTER_KEY_ITEMS = 'Key items';
const FILTER_OTHER_ITEMS = 'Other';

export {
  CLOCK_PAD, FILTER_KEY_ITEMS, FILTER_OTHER_ITEMS, GAME_INFO_EMPTY_TEXT, GAME_INFO_FEATURE,
  KEY_ITEM_FIRST_ID, LIVE_STATUSES, MAP_ID_WIDTH, TECH_FIRST_ID,
  TECH_PER_CHARACTER,
};
