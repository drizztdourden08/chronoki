/* @layer renderer-components @kind component */
import { DisabledOverlay } from '@drizztdourden08/tessera/composites';
import { LOCK_CAUSE_MESSAGES } from './LockOverlay.constants';
import type { LockOverlayProps } from './LockOverlay.type';

const LockOverlay = ({ cause, userMessage, onOpenSettings, children }: LockOverlayProps) => {
  const reason = LOCK_CAUSE_MESSAGES[cause] ?? cause;
  const message = userMessage ? `${reason}. ${userMessage}` : reason;
  return <DisabledOverlay active contained message={message} onOpenSettings={onOpenSettings}>{children}</DisabledOverlay>;
};

export { LockOverlay };
