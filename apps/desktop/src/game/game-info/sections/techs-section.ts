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

const inPartyRows = ({ party, techs }: ChronokiInfoSnapshot) => {
  const ids = new Set([...party.active, ...party.reserve].filter((id): id is number => id !== null));
  return techs.single.map((row, id) => ({ row, id })).filter(({ id }) => ids.has(id));
};

const techBlocks = (snapshot: ChronokiInfoSnapshot): Block[] => {
  const rows = inPartyRows(snapshot);
  const items = rows.flatMap(({ row, id }) => learnedItems(snapshot, id, row));
  const multiRow = { label: 'Dual and triple techs learned', value: snapshot.techs.multiLearned };
  if (items.length === 0 && snapshot.techs.multiLearned === 0) {
    return [{ kind: 'rows', rows: [{ label: 'Techs', value: 'No techs learned' }] }];
  }
  return [
    {
      kind: 'progress',
      items: rows.map(({ row, id }) => ({
        label: characterName(snapshot, id),
        done: row.filter(Boolean).length,
        total: row.length,
      })),
    },
    { kind: 'list', items },
    { kind: 'rows', rows: [multiRow] },
  ];
};

const techsSection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'techs',
  title: 'Techs',
  blocks: techBlocks,
};

export { techsSection };
