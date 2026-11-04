/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { isSlotAction } from './is-slot-action';

const useCancelOnOtherInput = (open: boolean, close: () => void): void => {
  useEffect(() => {
    if (!open) return undefined;
    const manager = getInputManager();
    const mappings = manager.getFunctionMappings();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.code === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      const isSlotKey = mappings.some(
        (entry) => entry.binding.type === 'keyboard' && entry.binding.code === event.code && isSlotAction(entry.action),
      );
      if (!isSlotKey) close();
    };
    window.addEventListener('keydown', onKeyDown);

    const slotButtons = new Set<number>();
    for (const entry of mappings) {
      if (entry.binding.type === 'gamepad-button' && isSlotAction(entry.action)) slotButtons.add(entry.binding.index);
    }
    const previous = new Map<string, boolean[]>();
    const unsubscribe = manager.onInputState((states) => {
      for (const [key, state] of states) {
        const before = previous.get(key) ?? [];
        const pressed = state.buttons.some((down, index) => down && !before[index] && !slotButtons.has(index));
        if (pressed) {
          close();
          return;
        }
        previous.set(key, [...state.buttons]);
      }
    });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      unsubscribe();
    };
  }, [open, close]);
};

export { useCancelOnOtherInput };
