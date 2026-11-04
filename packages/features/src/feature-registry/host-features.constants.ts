/* @layer shared @kind data */
import type { FeatureDef } from '../feature.type';

const hostFeature = (
  id: string,
  label: string,
  description: string,
  group: FeatureDef['group'],
  affectsVanillaParity: boolean,
): FeatureDef => ({
  id,
  label,
  description,
  userMessage: description,
  group,
  kind: 'host',
  origin: 'chronoki',
  default: false,
  requires: [],
  affectsVanillaParity,
  live: true,
});

const HOST_FEATURES: FeatureDef[] = [
  hostFeature('turbo', 'Turbo', 'Runs the game faster while a key is held.', 'Quality of life', true),
  hostFeature('linearFiltering', 'Linear filtering', 'Smooths the picture instead of sharp pixels.', 'Display', true),
  hostFeature('scaleStretch', 'Stretch to window', 'Stretches the picture to fill the window.', 'Display', true),
  hostFeature('saveStates', 'Save states', 'Save and load the whole game at any moment.', 'Saves', false),
  hostFeature('autoSave', 'Auto-save', 'Saves a state on its own at a set interval.', 'Saves', false),
  hostFeature('saveOnQuit', 'Save on quit', 'Saves a state when you leave the game.', 'Saves', false),
  { ...hostFeature('developerTools', 'Developer tools', 'Opens the developer tools.', 'Dev', false), kind: 'dev' },
];

export { HOST_FEATURES };
