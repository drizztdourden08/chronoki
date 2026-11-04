/* @layer renderer-components @kind logic */
import { frameSizeOf } from '@chronoki/game-core';
import type { CkArea, CkSettings } from '@chronoki/game-core';

const pictureFrameOf = (settings: CkSettings): CkArea => frameSizeOf({ ...settings, renderScale: 1, interpolation: false });

export { pictureFrameOf };
