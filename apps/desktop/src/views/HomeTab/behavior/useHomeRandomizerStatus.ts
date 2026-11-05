/* @layer renderer-components @kind hook */
import { useRandomizerSession } from '@drizztdourden08/brock-randomizer/renderer';
import { NO_SESSION_LABEL, STATUS_LABELS } from '../HomeTab.constants';
import type { HomeRandomizerStatus } from '../HomeTab.type';

const useHomeRandomizerStatus = (): HomeRandomizerStatus => {
  const { session, status } = useRandomizerSession();
  return { sessionStatusLabel: session ? STATUS_LABELS[status] : NO_SESSION_LABEL };
};

export { useHomeRandomizerStatus };
