/* @layer bridge-wasm @kind constants */
const NO_COMPLETED: ReadonlySet<string> = new Set<string>();

const SAVE_LOAD_LOG = '[Local] In-game save load detected (play clock jumped): re-baselining checks';

const GOAL_REACHED_LOG = '[Goal] Mode goal reached';

const START_CHECK_MAX_POLLS = 30;

export { GOAL_REACHED_LOG, NO_COMPLETED, SAVE_LOAD_LOG, START_CHECK_MAX_POLLS };
