/* @layer bridge-wasm @kind logic */
import { toast } from '@drizztdourden08/tessera/composites';
import { CORE_UNAVAILABLE_MESSAGE, CORE_UNAVAILABLE_TOAST_MS } from './platform-gate.constants';

const reportCoreUnavailable = (): void => {
  toast({ message: CORE_UNAVAILABLE_MESSAGE, variant: 'danger', duration: CORE_UNAVAILABLE_TOAST_MS });
};

export { reportCoreUnavailable };
