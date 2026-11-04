/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import { chronokiCore } from '@app/game/lifecycle';
import { startInput } from '@app/input/start-input';
import type { StartInputArgs } from '@app/input/start-input.type';

const useGameInput = (
  running: boolean,
  profileId: string | null,
  onFunctionAction: StartInputArgs['onFunctionAction'],
  onFunctionRelease: StartInputArgs['onFunctionRelease'],
): void => {
  useEffect(() => {
    if (!running || profileId === null) return undefined;
    const handle = startInput({ core: chronokiCore, profileId, onFunctionAction, onFunctionRelease });
    return handle.stop;
  }, [running, profileId, onFunctionAction, onFunctionRelease]);
};

export { useGameInput };
