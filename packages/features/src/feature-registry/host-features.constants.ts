/* @layer shared @kind data */
import type { FeatureDef } from '../feature.type';

const HOST_FEATURES: FeatureDef[] = [
  {
    id: 'turbo', label: 'Turbo', description: 'Runs the game faster while the Turbo shortcut is held.',
    userMessage: 'Runs the game faster while the Turbo shortcut is held.',
    group: 'Quality of life', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: true, live: true,
  },
  {
    id: 'linearFiltering', label: 'Linear Filtering', description: 'Apply bilinear interpolation for smoother, less pixelated visuals. Turn it off for crisp pixel art',
    userMessage: 'Pixel Perfect turns it off.',
    group: 'Display', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: true, live: true,
  },
  {
    id: 'saveStates', label: 'Save States', description: 'Save and load the whole game at any moment.',
    userMessage: 'Save and load the whole game at any moment.',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: true, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'enhancedSaveSlotShortcut', label: 'Hold Save for Slot Picker',
    description: 'Opens the save slot menu on shortcut press instead of immediately saving/loading',
    userMessage: 'Opens the save slot menu on shortcut press instead of immediately saving/loading',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: true, requires: ['saveStates'], affectsVanillaParity: true, live: true,
  },
  {
    id: 'autoSave', label: 'Enable Auto-Save', description: 'Automatically create save state snapshots at regular intervals during gameplay',
    userMessage: 'Automatically create save state snapshots at regular intervals during gameplay',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'saveOnQuit', label: 'Save on Quit', description: 'Automatically create a save state when you stop the game or close the app',
    userMessage: 'Automatically create a save state when you stop the game or close the app',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
];

export { HOST_FEATURES };
