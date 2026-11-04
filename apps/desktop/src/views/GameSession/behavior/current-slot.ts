/* @layer renderer-appshell @kind logic */
import { selected } from './selected-slot';

const currentSlot = (): number => selected.slot;

export { currentSlot };
