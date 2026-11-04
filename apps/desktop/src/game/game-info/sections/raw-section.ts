/* @layer bridge-wasm @kind logic */
import type { GameInfoSection } from '@drizztdourden08/brock-game-info';
import type { ChronokiInfoSnapshot } from '../game-info.type';
import { formatEpoch } from '../format-epoch';
import { formatPoint } from '../format-point';

const rawSection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'raw',
  title: 'Raw',
  developer: true,
  blocks: ({ location, story, party, songField, songOverworld }) => [
    {
      kind: 'rows',
      rows: [
        { label: 'Location id', value: location.id, mono: true },
        { label: 'Return id', value: location.returnId, mono: true },
        { label: 'Last inside id', value: location.lastInsideId, mono: true },
        { label: 'Arrival', value: `${location.arrivalX}, ${location.arrivalY}`, mono: true },
        { label: 'Lead', value: formatPoint(location.leadX, location.leadY), mono: true },
        { label: 'Epoch', value: formatEpoch(location.epoch), mono: true },
        { label: 'Story counter', value: story.counter, mono: true },
        { label: 'Joined mask', value: party.joinedMask, mono: true },
        { label: 'Song (field)', value: songField, mono: true },
        { label: 'Song (overworld)', value: songOverworld, mono: true },
      ],
    },
  ],
};

export { rawSection };
