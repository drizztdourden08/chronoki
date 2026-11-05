/* @layer bridge-wasm @kind logic */
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/renderer';
import { toast } from '@drizztdourden08/tessera/composites';
import { REFUSAL_TOAST_MS, START_MISMATCH_TOAST } from './chronoki-randomizer.constants';

const reportStartMismatch = (line: string): void => {
  appRandomizerLog(line, 'error');
  toast({ message: START_MISMATCH_TOAST, variant: 'danger', duration: REFUSAL_TOAST_MS });
};

export { reportStartMismatch };
