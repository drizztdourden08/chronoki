/* @layer renderer-components @kind constants */
import type { DockEdgeName } from './GameView.type';

const DOCK_GAP = 8;

const DOCK_GAP_TOLERANCE = 0.5;

const DOCK_SELECTOR = '.dock-layout';

const DOCK_MAIN_SELECTOR = '.dock-layout__main';

const BLEED_VARS: Record<DockEdgeName, string> = {
  top: '--game-bleed-top', right: '--game-bleed-right', bottom: '--game-bleed-bottom', left: '--game-bleed-left',
};

const DOCK_EDGE_NAMES: readonly DockEdgeName[] = ['top', 'right', 'bottom', 'left'];

export { BLEED_VARS, DOCK_EDGE_NAMES, DOCK_GAP, DOCK_GAP_TOLERANCE, DOCK_MAIN_SELECTOR, DOCK_SELECTOR };
