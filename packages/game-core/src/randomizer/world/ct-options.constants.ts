/* @layer bridge-wasm @kind constants */
import type { CtOptionDef } from './ct-option-def.type';

const CT_OPTION_CATALOG: readonly CtOptionDef[] = [
  { key: 'gameMode', label: 'Game mode', jotFlag: 'mode', default: 'standard', choices: ['standard'], frozen: true },
  {
    key: 'itemDifficulty', label: 'Item difficulty', jotFlag: 'e/n/h', default: 'normal',
    choices: ['easy', 'normal', 'hard'],
  },
  { key: 'enemyDifficulty', label: 'Enemy difficulty', jotFlag: 'n/h', default: 'normal', choices: ['normal', 'hard'] },
  { key: 'disableGlitches', label: 'Disable glitches', jotFlag: 'g', default: false },
  { key: 'bossScaling', label: 'Boss scaling', jotFlag: 'b', default: false },
  { key: 'earlyPendantCharge', label: 'Early pendant charge', jotFlag: 'p', default: false },
  { key: 'unlockedMagic', label: 'Unlocked magic', jotFlag: 'm', default: false },
  { key: 'lockedCharacters', label: 'Locked characters', jotFlag: 'c', default: false },
];

export { CT_OPTION_CATALOG };
