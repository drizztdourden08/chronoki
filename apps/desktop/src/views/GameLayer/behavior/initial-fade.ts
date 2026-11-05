/* @layer renderer-components @kind logic */
import type { FadeState } from './useEdgeGlowLoop.type';

const initialFade = (): FadeState => ({
  prevBlackLeft: -1, prevBlackRight: -1, prevBlackBottom: -1, prevBlackTop: -1, fadeOpacity: 1.0, fadeTarget: 1.0, lastTime: 0,
});

export { initialFade };
