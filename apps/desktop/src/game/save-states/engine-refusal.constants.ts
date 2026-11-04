/* @layer bridge-wasm @kind constants */
const ENGINE_REFUSAL_MESSAGES: Record<number, string> = {
  1: 'This file is not a save state.',
  2: 'This save state was made by a core with a different save state format.',
  3: 'This save state was taken in a place that cannot be loaded back yet.',
  5: 'This save state is damaged.',
};

const ENGINE_REFUSAL_FALLBACK = 'The game could not take this save state.';

export { ENGINE_REFUSAL_FALLBACK, ENGINE_REFUSAL_MESSAGES };
