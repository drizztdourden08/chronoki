/* @layer bridge-wasm @kind logic */
import type { Block, GameInfoSection } from '@drizztdourden08/brock-game-info';
import { formatMap } from '../format-map';
import { formatPoint } from '../format-point';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const locationBlocks = ({ eraName, location }: ChronokiInfoSnapshot): Block[] => [
  {
    kind: 'rows',
    rows: [
      { label: 'Era', value: eraName ?? 'Unknown' },
      { label: 'Map', value: formatMap(location.id), mono: true },
    ],
  },
];

const detailBlock = ({ location }: ChronokiInfoSnapshot): Block => ({
  kind: 'rows',
  rows: [
    { label: 'Previous map', value: formatMap(location.returnId), mono: true },
    { label: 'Lead position', value: formatPoint(location.leadX, location.leadY), mono: true },
  ],
});

const locationSection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'location',
  title: 'Location',
  blocks: (snapshot) => [...locationBlocks(snapshot), detailBlock(snapshot)],
  compact: locationBlocks,
};

export { locationSection };
