/* @layer renderer-components @kind logic */
import { useLayoutEffect, useState } from 'react';
import { NARROW_CONTAINER_WIDTH } from './controls.constants';

const useControlsNarrow = (): boolean => {
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.controls-settings');
    if (!root) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setNarrow(entry.contentRect.width < NARROW_CONTAINER_WIDTH);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  return narrow;
};

export { useControlsNarrow };
