/* @layer renderer-appshell @kind logic */
import { currentSlot } from './current-slot';
import { saveToSlot } from './save-to-slot';

const saveStateKey = (): Promise<void> => saveToSlot(currentSlot());

export { saveStateKey };
