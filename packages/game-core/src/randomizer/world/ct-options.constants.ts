/* @layer bridge-wasm @kind constants */
import type { CtOptionDef } from './ct-option-def.type';
import { CT_DEFAULT_MODE, CT_MODES } from './modes/ct-modes.constants';

const CT_OPTION_CATALOG: readonly CtOptionDef[] = [
  {
    key: 'gameMode', label: 'Game mode', jotFlag: 'mode', default: CT_DEFAULT_MODE,
    choices: CT_MODES.filter((mode) => mode.implemented).map((mode) => mode.id),
    section: 'Game', implemented: true,
    choiceLabels: Object.fromEntries(CT_MODES.filter((mode) => mode.implemented).map((mode) => [mode.id, mode.label])),
  },
  {
    key: 'itemDifficulty', label: 'Item difficulty', jotFlag: 'e/n/h', default: 'normal', choices: ['easy', 'normal', 'hard'],
    section: 'Difficulty', implemented: true, choiceLabels: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  },
  {
    key: 'enemyDifficulty', label: 'Enemy difficulty', jotFlag: 'n/h', default: 'normal', choices: ['normal', 'hard'],
    section: 'Difficulty', implemented: true, choiceLabels: { normal: 'Normal', hard: 'Hard' },
  },
  { key: 'bossScaling', label: 'Boss scaling', jotFlag: 'b', default: false, section: 'Difficulty', implemented: true },
  { key: 'disableGlitches', label: 'Disable glitches', jotFlag: 'g', default: false, section: 'Rules', implemented: true },
  { key: 'earlyPendantCharge', label: 'Early pendant charge', jotFlag: 'p', default: false, section: 'Rules', implemented: true },
  { key: 'unlockedMagic', label: 'Unlocked magic', jotFlag: 'm', default: false, section: 'Rules', implemented: true },
  { key: 'lockedCharacters', label: 'Locked characters', jotFlag: 'c', default: false, section: 'Rules', implemented: true },
  { key: 'addCyrusGraveSpot', label: "Add Cyrus's Grave spot", jotFlag: 'cyrus', default: false, section: 'Rules', implemented: false },
  { key: 'addOzzieSpot', label: "Add Ozzie's Fort spot", jotFlag: 'ozzie', default: false, section: 'Rules', implemented: false },
  { key: 'epochFail', label: 'Epoch fail', jotFlag: 'epochFail', default: false, section: 'Rules', implemented: true },
  {
    key: 'partyMode', label: 'Starting party', jotFlag: '-', default: 'random', choices: ['random', 'custom'],
    section: 'Party', implemented: true, choiceLabels: { random: 'Random', custom: 'Choose' },
  },
  { key: 'partySize', label: 'Random party size', jotFlag: '-', default: 2, choices: [1, 2, 3, 4, 5, 6, 7], section: 'Party', implemented: true },
  { key: 'startingParty', label: 'Party', jotFlag: '-', default: 'crono,marle', section: 'Party', implemented: true },
];

export { CT_OPTION_CATALOG };
