/* @layer renderer-components @kind logic */
import type { CkViewBlack } from '@chronoki/game-core';

const hasBlackExtent = (view: CkViewBlack): boolean => view.top > 0 || view.bottom > 0 || view.left > 0 || view.right > 0;

export { hasBlackExtent };
