/* @layer renderer-components @kind data */
const LOCK_CAUSE_MESSAGES: Record<string, string> = {
  vanillaSafe: 'Disabled in Vanilla Safe mode',
  requires: 'Needs another enhancement turned on first',
  missingData: 'Needs data you have not imported',
  developerBuild: 'Not available in a packaged build',
};

export { LOCK_CAUSE_MESSAGES };
