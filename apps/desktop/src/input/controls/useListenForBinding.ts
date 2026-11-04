/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import { getInputManager } from '../input-manager/get-input-manager';
import { LISTEN_ARM_DELAY_MS, MODIFIER_CODES } from './controls.constants';
import { keyboardBindingFromEvent } from './keyboard-binding-from-event';
import type { BindingListenerProps } from './controls.type';

const useListenForBinding = ({ onCapture, onCancel }: Pick<BindingListenerProps, 'onCapture' | 'onCancel'>) => {
  useEffect(() => {
    let cancelled = false;
    let captured = false;
    let unsubscribe: (() => void) | null = null;

    const handleKey = (e: KeyboardEvent) => {
      if (cancelled) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.code === 'Escape') {
        onCancel();
        return;
      }
      if (MODIFIER_CODES.has(e.code) || captured) return;
      captured = true;
      const isClear = e.code === 'Delete' || e.code === 'Backspace';
      onCapture(isClear ? { type: 'none' } : keyboardBindingFromEvent(e), 'keyboard');
    };

    const timeout = setTimeout(() => {
      if (cancelled) return;
      window.addEventListener('keydown', handleKey, true);
      unsubscribe = getInputManager().onRawInput((event) => {
        if (cancelled || captured || event.binding.type === 'keyboard') return;
        captured = true;
        onCapture(event.binding, event.sourceDeviceKey, event.vendorId, event.productId);
      });
    }, LISTEN_ARM_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      window.removeEventListener('keydown', handleKey, true);
      unsubscribe?.();
    };
  }, [onCapture, onCancel]);
};

export { useListenForBinding };
