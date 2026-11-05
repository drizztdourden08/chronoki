/* @layer renderer-components @kind logic */
import type { StageWait } from '../GameLayer.type';

const fullscreenPending = (wait: Pick<StageWait, 'fullscreen'>, isFullscreen: boolean): boolean =>
  wait.fullscreen === null || (wait.fullscreen && !isFullscreen);

export { fullscreenPending };
