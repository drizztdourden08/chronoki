/* @layer renderer-lib @kind hook */
import { useEffect } from 'react';
import { captureAllowed } from './capture-allowed.state';

const useSyncCaptureAllowed = (allowed: boolean): void => {
  useEffect(() => {
    captureAllowed.current = allowed;
    return () => {
      captureAllowed.current = false;
    };
  }, [allowed]);
};

export { useSyncCaptureAllowed };
