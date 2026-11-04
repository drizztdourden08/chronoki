/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { BLEED_VARS, DOCK_EDGE_NAMES, DOCK_MAIN_SELECTOR, DOCK_SELECTOR } from '../GameView.constants';
import { bleedOf } from './bleed-of';

/* Tessera's dock keeps a GAP border round its main slot. The game view bleeds over that border on every edge its slot touches
   (all four in fullscreen, or whenever no pane is docked beside it), so the stage runs edge to edge; never into a pane's gap. */
const useDockBleed = (viewRef: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const el = viewRef.current;
    const main = el?.closest<HTMLElement>(DOCK_MAIN_SELECTOR) ?? null;
    const dock = main?.parentElement?.closest<HTMLElement>(DOCK_SELECTOR) ?? null;
    if (!el || !main || !dock) return;
    const apply = (): void => {
      const bleed = bleedOf(main.getBoundingClientRect(), dock.getBoundingClientRect());
      for (const edge of DOCK_EDGE_NAMES) el.style.setProperty(BLEED_VARS[edge], `${bleed[edge]}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(main);
    observer.observe(dock);
    return () => {
      observer.disconnect();
      for (const edge of DOCK_EDGE_NAMES) el.style.removeProperty(BLEED_VARS[edge]);
    };
  }, [viewRef]);
};

export { useDockBleed };
