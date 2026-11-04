/* @layer renderer-components @kind constants */
const STEP_IDS = { profile: 'profile', mode: 'mode', review: 'review' } as const;

const STEP_LABELS = { profile: 'Profile', mode: 'Mode', review: 'Review' } as const;

const WIZARD_TITLE = 'New profile';
const FINISH_LABEL = 'Create profile';
const CREATING_HINT = 'Creating the profile';
const NO_NAME_ERROR = 'Give the profile a name.';
const NO_ROM_ERROR = 'Pick a ROM.';

const MODE_HINTS = {
  original: 'The game as it shipped.',
  enhanced: 'The game with ChronoKi changes applied.',
} as const;

export { CREATING_HINT, FINISH_LABEL, MODE_HINTS, NO_NAME_ERROR, NO_ROM_ERROR, STEP_IDS, STEP_LABELS, WIZARD_TITLE };
