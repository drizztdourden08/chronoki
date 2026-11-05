/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { inputSuppressedFor } from './input-suppressed-for';

const useMenuInputGate = (running: boolean): void => {
  const screenOpen = useNavigationStore((s) => s.active !== null);
  useEffect(() => {
    getInputManager().setInputSuppressed(inputSuppressedFor(running, screenOpen));
  }, [running, screenOpen]);
};

export { useMenuInputGate };
