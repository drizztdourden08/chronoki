/* @layer bridge-wasm @kind constants */
import type { Hint } from '@drizztdourden08/tessera/primitives';

const CHECKS_PREF_KEY = 'checks';
const CHECKS_WIDGET_ID = 'checks';
const NOTIFY_PREF = 'notify';
const NOTIFY_WHEN_CLOSED_PREF = 'notifyWhenClosed';

const NOTIFY_HINT: Hint = { label: 'Notifications', description: 'A card over the game for each check or event you complete' };

const NOTIFY_WHEN_CLOSED_HINT: Hint = { label: 'While closed', description: 'Keep notifying while this tracker is closed' };

export { CHECKS_PREF_KEY, CHECKS_WIDGET_ID, NOTIFY_HINT, NOTIFY_PREF, NOTIFY_WHEN_CLOSED_HINT, NOTIFY_WHEN_CLOSED_PREF };
