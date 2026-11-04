/* @layer renderer-components @kind logic */
import type { CkArea } from '@chronoki/game-core';

const deviceAreaOf = (el: HTMLElement): CkArea => {
  const dpr = window.devicePixelRatio || 1;
  return { width: Math.round(el.clientWidth * dpr), height: Math.round(el.clientHeight * dpr) };
};

export { deviceAreaOf };
