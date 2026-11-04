/* @layer bridge-wasm @kind logic */
import type { GameInfoSection } from '@drizztdourden08/brock-game-info';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const inventorySection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'inventory',
  title: 'Inventory',
  blocks: ({ inventory }) => [
    {
      kind: 'rows',
      rows: [
        { label: 'Item types', value: inventory.length },
        { label: 'Items held', value: inventory.reduce((sum, item) => sum + item.count, 0) },
      ],
    },
  ],
};

export { inventorySection };
