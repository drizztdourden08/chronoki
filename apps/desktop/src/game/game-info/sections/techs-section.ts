/* @layer bridge-wasm @kind logic */
import type { Block, GameInfoSection, InfoListItem } from '@drizztdourden08/brock-game-info';
import { TECH_FIRST_ID, TECH_PER_CHARACTER } from '../game-info.constants';
import type { ChronokiInfoSnapshot } from '../game-info.type';
import { nameOr } from '../name-or';

const characterName = ({ party }: ChronokiInfoSnapshot, id: number): string =>
  party.sheets.find((sheet) => sheet.id === id)?.name ?? `Character ${id}`;

const learnedItems = (snapshot: ChronokiInfoSnapshot, id: number, row: readonly boolean[]): InfoListItem[] =>
  row.flatMap((learned, bit) => {
    if (!learned) return [];
    const techId = TECH_FIRST_ID + id * TECH_PER_CHARACTER + bit;
    return [{ label: nameOr(snapshot.techNames[techId], `Tech ${techId}`), group: characterName(snapshot, id) }];
  });

const techBlocks = (snapshot: ChronokiInfoSnapshot): Block[] => [
  {
    kind: 'progress',
    items: snapshot.techs.single.map((row, id) => ({
      label: characterName(snapshot, id),
      done: row.filter(Boolean).length,
      total: row.length,
    })),
  },
  { kind: 'list', items: snapshot.techs.single.flatMap((row, id) => learnedItems(snapshot, id, row)) },
  { kind: 'rows', rows: [{ label: 'Dual and triple techs learned', value: snapshot.techs.multiLearned }] },
];

const techsSection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'techs',
  title: 'Techs',
  blocks: techBlocks,
};

export { techsSection };
