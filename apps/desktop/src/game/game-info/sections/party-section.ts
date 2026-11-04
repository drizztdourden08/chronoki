/* @layer bridge-wasm @kind logic */
import type { Block, GameInfoSection, InfoMember } from '@drizztdourden08/brock-game-info';
import type { GameInfoSheet } from '@chronoki/game-core';
import type { ChronokiInfoSnapshot } from '../game-info.type';

const memberOf = (sheet: GameInfoSheet, badge: string): InfoMember => ({
  name: sheet.name ?? `Character ${sheet.id}`,
  badge: sheet.ko ? 'KO' : badge,
  level: sheet.level,
  bars: [
    { label: 'HP', current: sheet.hp, max: sheet.maxHp },
    { label: 'MP', current: sheet.mp, max: sheet.maxMp },
  ],
});

const membersOf = (ids: readonly (number | null)[], sheets: readonly GameInfoSheet[], badge: string): InfoMember[] =>
  ids.flatMap((id) => {
    const sheet = sheets.find((candidate) => candidate.id === id);
    return sheet ? [memberOf(sheet, badge)] : [];
  });

const partyBlocks = ({ party }: ChronokiInfoSnapshot): Block[] => [
  { kind: 'members', members: [...membersOf(party.active, party.sheets, ''), ...membersOf(party.reserve, party.sheets, 'Reserve')] },
];

const partySection: GameInfoSection<ChronokiInfoSnapshot> = {
  id: 'party',
  title: 'Party',
  blocks: partyBlocks,
  compact: partyBlocks,
};

export { partySection };
