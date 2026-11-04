/* @layer shared @kind data */
import type { FeatureDef } from '../feature.type';

const HOST_FEATURES: FeatureDef[] = [
  {
    id: 'turbo', label: 'Turbo', description: 'Runs the game faster while the Turbo shortcut is held.',
    userMessage: 'Runs the game faster while the Turbo shortcut is held.',
    group: 'Quality of life', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'linearFiltering', label: 'Linear Filtering', description: 'Apply bilinear interpolation for smoother, less pixelated visuals. Turn it off for crisp pixel art',
    userMessage: 'Pixel Perfect turns it off.',
    group: 'Display', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'saveStates', label: 'Save States', description: 'Save and load the whole game at any moment.',
    userMessage: 'Save and load the whole game at any moment.',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: true, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'enhancedSaveSlotShortcut', label: 'Enhanced Save Slot Shortcut',
    description: 'Opens the save slot menu on shortcut press instead of immediately saving/loading',
    userMessage: 'Opens the save slot menu on shortcut press instead of immediately saving/loading',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: true, requires: ['saveStates'], affectsVanillaParity: false, live: true,
  },
  {
    id: 'autoSave', label: 'Enable Auto-Save', description: 'Automatically create save state snapshots at regular intervals during gameplay',
    userMessage: 'Automatically create save state snapshots at regular intervals during gameplay',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'saveOnQuit', label: 'Save on Quit', description: 'Automatically create a save state when you stop the game or close the app',
    userMessage: 'Automatically create a save state when you stop the game or close the app',
    group: 'Saves', kind: 'host', origin: 'chronoki', default: true, requires: [], affectsVanillaParity: false, live: true,
  },
  {
    id: 'perGroupVolume', label: 'Independent Music / SFX', description: 'Set music and sound effects apart, with a volume for each.',
    userMessage: 'Set music and sound effects apart, with a volume for each.',
    group: 'Audio', kind: 'host', origin: 'chronoki', default: true, requires: [], affectsVanillaParity: true, live: true,
  },
  {
    id: 'gameInfo', label: 'Game Info widget',
    description: 'Reads location, party, gold, time and story progress from the running game for the Game Info widget.',
    userMessage: 'Read only: it never changes what the game computes. Off in Vanilla Safe.',
    group: 'Quality of life', kind: 'host', origin: 'chronoki', default: true, requires: [], affectsVanillaParity: true, live: true,
  },
  {
    id: 'randomizer', label: 'Randomizer',
    description: 'Lets a new profile shuffle where treasure is found, from a seed, and tracks the checks while you play.',
    userMessage: 'Changes the game\'s treasure. New randomizer profiles need it on. Off in Vanilla Safe.',
    group: 'Quality of life', kind: 'host', origin: 'chronoki', default: false, requires: [], affectsVanillaParity: true, live: false,
  },
];

export { HOST_FEATURES };
