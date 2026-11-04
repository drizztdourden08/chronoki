/* @layer renderer-components @kind data */
const LOCK_CAUSE_MESSAGES: Record<string, string> = {
  vanillaSafe: 'Off in Original mode',
  requires: 'Needs another enhancement turned on first',
  missingData: 'Needs data you have not imported',
  developerBuild: 'Not available in a packaged build',
};

export { LOCK_CAUSE_MESSAGES };
