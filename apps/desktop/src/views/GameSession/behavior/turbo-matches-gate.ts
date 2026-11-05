/* @layer renderer-appshell @kind logic */
import type { HostProbeEntry } from '@app/ipc/event-log-entry.type';

const turboMatchesGate = ({ expected, extraFrames, heldDuring, restored }: HostProbeEntry['turbo']): boolean => {
  if (!restored) return false;
  if (expected) return extraFrames > 0 && heldDuring;
  return extraFrames === 0 && !heldDuring;
};

export { turboMatchesGate };
