/* @layer bridge-wasm @kind logic */
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { toast } from '@drizztdourden08/tessera/composites';
import { REFUSAL_TOAST_MS } from './chronoki-randomizer.constants';

const reportBootRefusal = (reason: string): void => {
  appRandomizerLog(`[Boot] Game not started: ${reason}`, 'error');
  toast({ message: reason, variant: 'danger', duration: REFUSAL_TOAST_MS });
};

export { reportBootRefusal };
