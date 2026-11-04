/* @layer shared @kind data */
import type { FeatureDef } from '../feature.type';

const HOST_FEATURES: FeatureDef[] = [
  {
    id: 'turbo', label: 'Turbo', description: 'Runs the game faster while a key is held.',
    userMessage: 'Runs the game faster while a key is held.',
    group: 'Quality of life', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: true, live: true,
  },
  {
    id: 'linearFiltering', label: 'Linear filtering', description: 'Smooths the picture instead of sharp pixels.',
    userMessage: 'Smooths the picture instead of sharp pixels.',
    group: 'Display', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: true, live: true,
  },
  {
    id: 'scaleStretch', label: 'Stretch to window', description: 'Stretches the picture to fill the window.',
    userMessage: 'Stretches the picture to fill the window.',
    group: 'Display', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: true, live: true,
  },
  {
    id: 'saveStates', label: 'Save states', description: 'Save and load the whole game at any moment.',
    userMessage: 'Save and load the whole game at any moment.',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'autoSave', label: 'Auto-save', description: 'Saves a state on its own at a set interval.',
    userMessage: 'Saves a state on its own at a set interval.',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'saveOnQuit', label: 'Save on quit', description: 'Saves a state when you leave the game.',
    userMessage: 'Saves a state when you leave the game.',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
];

export { HOST_FEATURES };
