/* @layer renderer-components @kind constants */
import type { CtOptionSection } from './CtOptionsStepBody.type';

const CT_OPTION_SECTIONS: readonly CtOptionSection[] = [
  { id: 'game', title: 'Game', keys: ['gameMode'] },
  { id: 'difficulty', title: 'Difficulty', keys: ['itemDifficulty', 'enemyDifficulty', 'bossScaling'] },
  { id: 'rules', title: 'Rules', keys: ['disableGlitches', 'earlyPendantCharge', 'unlockedMagic', 'lockedCharacters'] },
];

const FROZEN_HINT = 'Fixed for this version of the randomizer.';

export { CT_OPTION_SECTIONS, FROZEN_HINT };
