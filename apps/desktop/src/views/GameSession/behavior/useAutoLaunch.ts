/* @layer renderer-appshell @kind hook */
import { useEffect, useRef } from 'react';
import { isAutoStart } from '@app/launch-flags/is-auto-start';
import { isProbeState } from '@app/launch-flags/is-probe-state';
import { probeFrames } from '@app/launch-flags/probe-frames';

const wantsAutoLaunch = (): boolean => isAutoStart() || isProbeState() || probeFrames() !== null;

const useAutoLaunch = (ready: boolean, play: () => void): void => {
  const done = useRef(false);

  useEffect(() => {
    if (!ready || done.current || !wantsAutoLaunch()) return;
    done.current = true;
    play();
  }, [ready, play]);
};

export { useAutoLaunch };
