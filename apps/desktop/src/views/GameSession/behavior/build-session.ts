/* @layer renderer-appshell @kind logic */
import type { PlaySession } from '@drizztdourden08/brock-core';
import type { GateMode } from '@chronoki/design';

const buildSession = (profileId: string, startedAt: number, mode: GateMode): PlaySession => {
  const endedAt = Date.now();
  return {
    id: `${startedAt.toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    profileId,
    startedAt,
    endedAt,
    durationMs: endedAt - startedAt,
    stats: { mode },
  };
};

export { buildSession };
