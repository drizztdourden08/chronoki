/* @layer renderer-components @kind logic */
import type { StageWait } from '../GameLayer.type';

/* The boot keeps waiting (up to the settle cap) while the start-fullscreen choice is still unknown, or while a
   requested fullscreen has not reached the window yet. */
const fullscreenPending = (wait: Pick<StageWait, 'fullscreen'>, isFullscreen: boolean): boolean =>
  wait.fullscreen === null || (wait.fullscreen && !isFullscreen);

export { fullscreenPending };
