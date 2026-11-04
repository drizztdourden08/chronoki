/* @layer renderer-components @kind constants */
const STEP_IDS = { profile: 'profile', review: 'review' } as const;

const STEP_LABELS = { profile: 'Profile', review: 'Review' } as const;

const WIZARD_TITLE = 'New profile';
const FINISH_LABEL = 'Create profile';
const CREATING_HINT = 'Creating the profile';
const NO_NAME_ERROR = 'Give the profile a name.';
const NO_ROM_ERROR = 'Pick a ROM.';

export { CREATING_HINT, FINISH_LABEL, NO_NAME_ERROR, NO_ROM_ERROR, STEP_IDS, STEP_LABELS, WIZARD_TITLE };
