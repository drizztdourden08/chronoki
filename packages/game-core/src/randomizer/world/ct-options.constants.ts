/* @layer bridge-wasm @kind constants */
import type { CtOptionDef } from './ct-option-def.type';
import { CT_DEFAULT_MODE, CT_MODES } from './modes/ct-modes.constants';

const SOON_SUFFIX = ' (not available yet)';

const CT_OPTION_CATALOG: readonly CtOptionDef[] = [
  {
    key: 'gameMode', label: 'Game mode', jotFlag: 'mode', default: CT_DEFAULT_MODE,
    choices: CT_MODES.map((mode) => mode.id),
    disabledChoices: CT_MODES.filter((mode) => !mode.implemented).map((mode) => mode.id),
    section: 'Game',
    choiceLabels: Object.fromEntries(CT_MODES.map((mode) => [mode.id, mode.implemented ? mode.label : mode.label + SOON_SUFFIX])),
  },
  {
    key: 'itemDifficulty', label: 'Item difficulty', jotFlag: 'e/n/h', default: 'normal', choices: ['easy', 'normal', 'hard'],
    section: 'Difficulty', choiceLabels: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  },
  {
    key: 'enemyDifficulty', label: 'Enemy difficulty', jotFlag: 'n/h', default: 'normal', choices: ['normal', 'hard'],
    section: 'Difficulty', choiceLabels: { normal: 'Normal', hard: 'Hard' },
  },
  { key: 'bossScaling', label: 'Boss scaling', jotFlag: 'b', default: false, section: 'Difficulty' },
  { key: 'disableGlitches', label: 'Disable glitches', jotFlag: 'g', default: false, section: 'Rules' },
  { key: 'earlyPendantCharge', label: 'Early pendant charge', jotFlag: 'p', default: false, section: 'Rules' },
  { key: 'unlockedMagic', label: 'Unlocked magic', jotFlag: 'm', default: false, section: 'Rules' },
  { key: 'lockedCharacters', label: 'Locked characters', jotFlag: 'c', default: false, section: 'Rules' },
];

export { CT_OPTION_CATALOG };
