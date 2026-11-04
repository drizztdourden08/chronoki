/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { PIXEL_PERFECT_HEIGHT_VAR, PIXEL_PERFECT_WIDTH_VAR } from '../GameLayer.constants';

const usePixelPerfectSize = (stageRef: RefObject<HTMLElement | null>, enabled: boolean, source: { width: number; height: number }): void => {
  const { width, height } = source;
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !enabled) return;
    const apply = (): void => {
      const dpr = window.devicePixelRatio || 1;
      const scale = Math.max(1, Math.floor(Math.min((el.clientWidth * dpr) / width, (el.clientHeight * dpr) / height)));
      el.style.setProperty(PIXEL_PERFECT_WIDTH_VAR, `${(width * scale) / dpr}px`);
      el.style.setProperty(PIXEL_PERFECT_HEIGHT_VAR, `${(height * scale) / dpr}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.removeProperty(PIXEL_PERFECT_WIDTH_VAR);
      el.style.removeProperty(PIXEL_PERFECT_HEIGHT_VAR);
    };
  }, [stageRef, enabled, width, height]);
};

export { usePixelPerfectSize };
