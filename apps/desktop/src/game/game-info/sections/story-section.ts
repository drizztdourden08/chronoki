/* @layer bridge-wasm @kind logic */
import type { Block, GameInfoSection } from '@drizztdourden08/brock-game-info';
import { formatClock } from '../format-clock';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const compactBlocks = ({ clock, gold }: ChronokiInfoSnapshot): Block[] => [
  {
    kind: 'rows',
    rows: [
      { label: 'Time', value: formatClock(clock), mono: true },
      { label: 'Gold', value: gold, mono: true },
    ],
  },
];

const storyBlocks = (snapshot: ChronokiInfoSnapshot): Block[] => [
  ...compactBlocks(snapshot),
  {
    kind: 'rows',
    rows: [
      { label: 'Saves', value: snapshot.saveCount },
      { label: 'Chests opened', value: snapshot.story.chestsOpened, spoiler: true },
    ],
  },
];

const storySection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'story',
  title: 'Story',
  blocks: storyBlocks,
  compact: compactBlocks,
};

export { storySection };
