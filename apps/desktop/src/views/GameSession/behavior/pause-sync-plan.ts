/* @layer renderer-appshell @kind logic */
import type { PauseSyncInputs, PauseSyncPlan } from '../GameSession.type';

const pauseSyncPlan = ({ running, inputPaused, status }: PauseSyncInputs): PauseSyncPlan => {
  if (!running) return { releaseInput: inputPaused, corePaused: null };
  if (status === 'running' && inputPaused) return { releaseInput: false, corePaused: true };
  if (status === 'paused' && !inputPaused) return { releaseInput: false, corePaused: false };
  return { releaseInput: false, corePaused: null };
};

export { pauseSyncPlan };
