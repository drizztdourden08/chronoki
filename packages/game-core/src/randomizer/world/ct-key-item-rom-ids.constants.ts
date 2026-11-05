/* @layer bridge-wasm @kind constants */
import type { CtBaseKeyItem } from './ct-world-keys.type';

const CT_KEY_ITEM_ROM_IDS: Readonly<Record<CtBaseKeyItem, number>> = {
  'gate-key': 0xd7,
  pendant: 0xd6,
  dreamstone: 0xdc,
  'ruby-knife': 0xe0,
  'c-trigger': 0xd9,
  clone: 0xe2,
  'bent-sword': 0x50,
  'bent-hilt': 0x51,
  'hero-medal': 0xb3,
  'prism-shard': 0xd8,
  'moon-stone': 0xde,
  'tomas-pop': 0xe3,
  jerky: 0xdb,
  'grand-leon': 0x42,
  'robo-ribbon': 0xb8,
};

export { CT_KEY_ITEM_ROM_IDS };
