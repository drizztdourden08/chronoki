/* @layer renderer-lib @kind logic */
import { handleHapticEvent, hapticState } from '@chronoki/input-mapping';

const onHapticEvent = (eventType: number, param: number): void => {
  hapticState.counts.coreHooks++;
  handleHapticEvent(eventType, param);
};

export { onHapticEvent };
