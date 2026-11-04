/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { CkArea } from '@chronoki/game-core';
import { deviceAreaOf } from './device-area-of';

const useStageArea = (stageRef: RefObject<HTMLElement | null>, onArea: (area: CkArea) => void): void => {
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let last = '';
    const report = (): void => {
      const area = deviceAreaOf(el);
      const key = `${area.width}x${area.height}`;
      if (key === last || area.width <= 0 || area.height <= 0) return;
      last = key;
      onArea(area);
    };
    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stageRef, onArea]);
};

export { useStageArea };
