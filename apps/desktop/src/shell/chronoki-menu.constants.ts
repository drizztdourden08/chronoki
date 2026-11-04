/* @layer renderer-app @kind constants */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { toggleSaveOverlay } from '@app/views/GameSession';

const CHRONOKI_MENU: MenuEntry[] = [
  { key: 'save-states', label: 'Save States', description: 'Open the save state slots while the game runs.', onClick: toggleSaveOverlay },
];

export { CHRONOKI_MENU };
