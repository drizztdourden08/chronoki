/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { PRESENT_RATIO_VAR } from '../GameLayer.constants';
import type { PresentBox } from '../GameLayer.type';

const usePresentRatioVar = (stageRef: RefObject<HTMLElement | null>, box: PresentBox): void => {
  const { width, height, boxed } = box;
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !boxed) return;
    el.style.setProperty(PRESENT_RATIO_VAR, `${width} / ${height}`);
    return () => el.style.removeProperty(PRESENT_RATIO_VAR);
  }, [stageRef, boxed, width, height]);
};

export { usePresentRatioVar };
