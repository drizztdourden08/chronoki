/* @layer renderer-components @kind hook */
import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

const usePendulumScale = (frameRef: RefObject<HTMLElement | null>, artHeight: number): number => {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || artHeight <= 0) return undefined;
    const measure = () => setScale(Math.max(1, Math.ceil(frame.clientHeight / artHeight)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef, artHeight]);

  return scale;
};

export { usePendulumScale };
