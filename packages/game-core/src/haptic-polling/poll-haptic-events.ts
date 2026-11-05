/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { CK_EXPORT_HAPTIC_POLL } from './haptic-polling.constants';
import type { HapticEventHandler } from './haptic-polling.type';
import { readHapticEvents } from './read-haptic-events';

const pollHapticEvents = (calls: CoreCalls, onEvent: HapticEventHandler): void => {
  if (!calls.has(CK_EXPORT_HAPTIC_POLL)) return;
  const events = readHapticEvents(calls.heap(), calls.number(CK_EXPORT_HAPTIC_POLL));
  for (const event of events) onEvent(event.kind, event.param);
};

export { pollHapticEvents };
