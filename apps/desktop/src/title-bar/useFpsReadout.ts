/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { presentedFrames } from '@app/views/GameSession/behavior/presented-frames';
import { FPS_SAMPLE_MS } from './title-bar.constants';

const useFpsReadout = (enabled: boolean): number => {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setFps(0);
      return undefined;
    }
    let last = { frames: presentedFrames(), at: performance.now() };
    const id = setInterval(() => {
      const now = { frames: presentedFrames(), at: performance.now() };
      const elapsed = (now.at - last.at) / 1000;
      setFps(elapsed > 0 && now.frames >= last.frames ? Math.round((now.frames - last.frames) / elapsed) : 0);
      last = now;
    }, FPS_SAMPLE_MS);
    return () => clearInterval(id);
  }, [enabled]);
  return fps;
};

export { useFpsReadout };
