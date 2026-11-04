/* @layer renderer-components @kind logic */
import type { CkPresentMode } from '@chronoki/game-core';
import type { ViewportMode } from '@app/settings.type';

const presentModeOf = (viewport: ViewportMode, pixelPerfect: boolean): CkPresentMode => {
  if (viewport === 'fill') return 'stretch';
  return pixelPerfect ? 'whole' : 'fit';
};

export { presentModeOf };
