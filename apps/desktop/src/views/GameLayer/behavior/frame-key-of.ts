/* @layer renderer-components @kind logic */
import type { CkSettings } from '@chronoki/game-core';
import { pictureFrameOf } from './picture-frame-of';

const frameKeyOf = (settings: CkSettings): string => {
  const { width, height } = pictureFrameOf(settings);
  return `${width}x${height}`;
};

export { frameKeyOf };
