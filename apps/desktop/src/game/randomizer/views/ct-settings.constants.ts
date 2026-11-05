/* @layer renderer-components @kind constants */
import type { CtOptionValues } from '@chronoki/game-core';

const SCOPE_SECTION = 'Randomization';

const SCOPE_EXCLUDED: readonly string[] = ['mysterySeed', 'duplicateCharacters', 'duplicateAllSlots'];

const OPTIONS_PAGE = 'options';

const SHOW_ALL_LABEL = 'Show all options';

const SCOPES_TITLE = 'Shuffle scopes';

const FLAG_MIN_WIDTH = 140;

const SETTING_TILES: readonly { key: keyof CtOptionValues; label: string }[] = [
  { key: 'gameMode', label: 'Game mode' },
  { key: 'itemDifficulty', label: 'Item difficulty' },
  { key: 'enemyDifficulty', label: 'Enemy difficulty' },
];

export { FLAG_MIN_WIDTH, OPTIONS_PAGE, SCOPES_TITLE, SCOPE_EXCLUDED, SCOPE_SECTION, SETTING_TILES, SHOW_ALL_LABEL };
