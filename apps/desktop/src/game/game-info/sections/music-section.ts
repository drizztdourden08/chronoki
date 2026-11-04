/* @layer bridge-wasm @kind logic */
import type { GameInfoSection } from '@drizztdourden08/brock-game-info';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const musicSection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'music',
  title: 'Music',
  blocks: ({ location, songField, songOverworld }) => [
    { kind: 'rows', rows: [{ label: 'Song', value: location.overworld ? songOverworld : songField, mono: true }] },
  ],
};

export { musicSection };
