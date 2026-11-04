/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { presentBoxOf, presentSizeOf } from '@chronoki/game-core';
import type { CkPresentMode } from '@chronoki/game-core';
import { CANVAS_CLIP_X_VAR, CANVAS_CLIP_Y_VAR, CANVAS_HEIGHT_VAR, CANVAS_VARS, CANVAS_WIDTH_VAR } from '../GameLayer.constants';
import type { SessionPicture } from '../GameLayer.type';
import { deviceAreaOf } from './device-area-of';

/* Sizes the canvas to cover its box on the stage and clips what passes the box (the stage clips what passes the stage). */
const usePresentSize = (stageRef: RefObject<HTMLElement | null>, picture: SessionPicture | null, mode: CkPresentMode): void => {
  const width = picture?.frame.width ?? 0;
  const height = picture?.frame.height ?? 0;
  const ratio = picture?.ratio ?? 0;
  useEffect(() => {
    const el = stageRef.current;
    if (!el || width <= 0 || height <= 0) return;
    const apply = (): void => {
      const dpr = window.devicePixelRatio || 1;
      const stage = deviceAreaOf(el);
      const frame = { width, height };
      const size = presentSizeOf(stage, frame, ratio, mode);
      const box = presentBoxOf(stage, frame, ratio, mode);
      el.style.setProperty(CANVAS_WIDTH_VAR, `${size.width / dpr}px`);
      el.style.setProperty(CANVAS_HEIGHT_VAR, `${size.height / dpr}px`);
      el.style.setProperty(CANVAS_CLIP_X_VAR, `${Math.max(0, size.width - box.width) / 2 / dpr}px`);
      el.style.setProperty(CANVAS_CLIP_Y_VAR, `${Math.max(0, size.height - box.height) / 2 / dpr}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      for (const name of CANVAS_VARS) el.style.removeProperty(name);
    };
  }, [stageRef, width, height, ratio, mode]);
};

export { usePresentSize };
