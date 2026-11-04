/* @layer bridge-wasm @kind logic */
import type { Block, GameInfoSection, InfoListItem } from '@drizztdourden08/brock-game-info';
import type { GameInfoItem } from '@chronoki/game-core';
import { FILTER_KEY_ITEMS, FILTER_OTHER_ITEMS, KEY_ITEM_FIRST_ID } from '../game-info.constants';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const isKey = (item: GameInfoItem): boolean => item.id >= KEY_ITEM_FIRST_ID;

const listItem = (item: GameInfoItem, names: ChronokiInfoSnapshot['itemNames']): InfoListItem => ({
  label: names[item.id] || `Item ${item.id}`,
  count: item.count,
  group: isKey(item) ? FILTER_KEY_ITEMS : FILTER_OTHER_ITEMS,
});

const inventoryBlocks = ({ inventory, itemNames }: ChronokiInfoSnapshot): Block[] => [
  {
    kind: 'rows',
    rows: [
      { label: 'Item types', value: inventory.length },
      { label: 'Items held', value: inventory.reduce((sum, item) => sum + item.count, 0) },
    ],
  },
  {
    kind: 'list',
    items: [...inventory.filter(isKey), ...inventory.filter((item) => !isKey(item))].map((item) => listItem(item, itemNames)),
    filters: [FILTER_KEY_ITEMS, FILTER_OTHER_ITEMS],
  },
];

const inventorySection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'inventory',
  title: 'Inventory',
  blocks: inventoryBlocks,
};

export { inventorySection };
