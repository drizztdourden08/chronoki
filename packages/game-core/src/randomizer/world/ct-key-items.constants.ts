/* @layer bridge-wasm @kind constants */
import type { CtKeyItem } from './ct-world-keys.type';

const CT_KEY_ITEMS: readonly CtKeyItem[] = [
  'gate-key', 'pendant', 'dreamstone', 'ruby-knife', 'c-trigger', 'clone', 'bent-sword', 'bent-hilt', 'hero-medal',
  'prism-shard', 'moon-stone', 'tomas-pop', 'jerky', 'grand-leon', 'robo-ribbon',
];

const CT_KEY_ITEM_NAMES: Readonly<Record<CtKeyItem, string>> = {
  'gate-key': 'Gate Key',
  pendant: 'Pendant',
  dreamstone: 'Dreamstone',
  'ruby-knife': 'Ruby Knife',
  'c-trigger': 'Chrono Trigger',
  clone: 'Clone',
  'bent-sword': 'Bent Sword',
  'bent-hilt': 'Bent Hilt',
  'hero-medal': 'Hero Medal',
  'prism-shard': 'Prism Shard',
  'moon-stone': 'Moon Stone',
  'tomas-pop': "Toma's Pop",
  jerky: 'Jerky',
  'grand-leon': 'Grand Leon',
  'robo-ribbon': "Robo's Ribbon",
};

const VANILLA_KEY_ITEM_ROM_IDS: ReadonlySet<number> = new Set([
  0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xde, 0xdf, 0xe0, 0xe2, 0xe3, 0xe9,
]);

const TREASURE_ITEM_PREFIX = 'treasure-';

export { CT_KEY_ITEMS, CT_KEY_ITEM_NAMES, TREASURE_ITEM_PREFIX, VANILLA_KEY_ITEM_ROM_IDS };
