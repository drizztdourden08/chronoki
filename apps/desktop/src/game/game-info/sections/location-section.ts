/* @layer bridge-wasm @kind logic */
import type { Block, GameInfoSection } from '@drizztdourden08/brock-game-info';
import { MAP_ID_WIDTH } from '../game-info.constants';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const locationBlocks = ({ eraName, location }: ChronokiInfoSnapshot): Block[] => [
  {
    kind: 'rows',
    rows: [
      { label: 'Era', value: eraName ?? 'Unknown' },
      { label: 'Map', value: { id: location.id, width: MAP_ID_WIDTH }, mono: true },
    ],
  },
];

const locationSection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'location',
  title: 'Location',
  blocks: locationBlocks,
  compact: locationBlocks,
};

export { locationSection };
