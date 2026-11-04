/* @layer bridge-wasm @kind logic */
import type { GameInfoSection } from '@drizztdourden08/brock-game-info';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const techsSection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'techs',
  title: 'Techs',
  blocks: ({ techs }) => [
    {
      kind: 'rows',
      rows: [
        { label: 'Single techs learned', value: techs.single.reduce((sum, row) => sum + row.filter(Boolean).length, 0) },
        { label: 'Multi techs learned', value: techs.multiLearned },
      ],
    },
  ],
};

export { techsSection };
