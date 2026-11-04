/* @layer renderer-components @kind logic */
import { DOCK_GAP, DOCK_GAP_TOLERANCE } from '../GameView.constants';
import type { DockBleed, EdgeRect } from '../GameView.type';

const edgeBleed = (offset: number): number => (offset > 0 && offset <= DOCK_GAP + DOCK_GAP_TOLERANCE ? offset : 0);

/* How far the main slot sits inside the dock on each edge, kept only where that is the dock's own border (a docked pane
   beside the slot puts it further in, and that edge gets no bleed). */
const bleedOf = (main: EdgeRect, dock: EdgeRect): DockBleed => ({
  top: edgeBleed(main.top - dock.top),
  right: edgeBleed(dock.right - main.right),
  bottom: edgeBleed(dock.bottom - main.bottom),
  left: edgeBleed(main.left - dock.left),
});

export { bleedOf };
