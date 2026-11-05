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
    section: 'Difficulty', implemented: false, choiceLabels: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  },
  {
    key: 'enemyDifficulty', label: 'Enemy difficulty', jotFlag: 'n/h', default: 'normal', choices: ['normal', 'hard'],
    section: 'Difficulty', implemented: false, choiceLabels: { normal: 'Normal', hard: 'Hard' },
  },
  { key: 'bossScaling', label: 'Boss scaling', jotFlag: 'b', default: false, section: 'Difficulty', implemented: false },
  { key: 'disableGlitches', label: 'Disable glitches', jotFlag: 'g', default: false, section: 'Rules', implemented: false },
  { key: 'earlyPendantCharge', label: 'Early pendant charge', jotFlag: 'p', default: false, section: 'Rules', implemented: false },
  { key: 'unlockedMagic', label: 'Unlocked magic', jotFlag: 'm', default: false, section: 'Rules', implemented: false },
  { key: 'lockedCharacters', label: 'Locked characters', jotFlag: 'c', default: false, section: 'Rules', implemented: true },
];

export { CT_OPTION_CATALOG };
