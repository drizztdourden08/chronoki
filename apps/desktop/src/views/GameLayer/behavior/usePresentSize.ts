/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { presentSizeOf } from '@chronoki/game-core';
import type { CkPresentMode } from '@chronoki/game-core';
import { CANVAS_HEIGHT_VAR, CANVAS_WIDTH_VAR } from '../GameLayer.constants';
import type { SessionPicture } from '../GameLayer.type';
import { deviceAreaOf } from './device-area-of';

const usePresentSize = (stageRef: RefObject<HTMLElement | null>, picture: SessionPicture | null, mode: CkPresentMode): void => {
  const width = picture?.frame.width ?? 0;
  const height = picture?.frame.height ?? 0;
  const ratio = picture?.ratio ?? 0;
  useEffect(() => {
    const el = stageRef.current;
    if (!el || width <= 0 || height <= 0) return;
    const apply = (): void => {
      const dpr = window.devicePixelRatio || 1;
      const size = presentSizeOf(deviceAreaOf(el), { width, height }, ratio, mode);
      el.style.setProperty(CANVAS_WIDTH_VAR, `${size.width / dpr}px`);
      el.style.setProperty(CANVAS_HEIGHT_VAR, `${size.height / dpr}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.removeProperty(CANVAS_WIDTH_VAR);
      el.style.removeProperty(CANVAS_HEIGHT_VAR);
    };
  }, [stageRef, width, height, ratio, mode]);
};

export { usePresentSize };
