/* @layer renderer-appshell @kind hook */
import { useEffect, useRef } from 'react';
import { isAutoStart } from '@app/launch-flags/is-auto-start';
import { isProbeInput } from '@app/launch-flags/is-probe-input';
import { isProbeSram } from '@app/launch-flags/is-probe-sram';
import { isProbeState } from '@app/launch-flags/is-probe-state';
import { probeFrames } from '@app/launch-flags/probe-frames';

const wantsAutoLaunch = (): boolean => isAutoStart() || isProbeState() || isProbeInput() || isProbeSram() || probeFrames() !== null;

const useAutoLaunch = (ready: boolean, play: () => void): void => {
  const done = useRef(false);

  useEffect(() => {
    if (!ready || done.current || !wantsAutoLaunch()) return;
    done.current = true;
    play();
  }, [ready, play]);
};

export { useAutoLaunch };
