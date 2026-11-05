/* @layer renderer-components @kind logic */
import type { CkViewBlack } from '@chronoki/game-core';
import { FADE_IN_PER_SECOND, FADE_OUT_PER_SECOND, SCREEN_CROSSING_JUMP_PX } from './useEdgeGlowLoop.constants';
import type { FadeState } from './useEdgeGlowLoop.type';

const boundsJumped = (fade: FadeState, view: CkViewBlack): boolean =>
  Math.abs(view.left - fade.prevBlackLeft) > SCREEN_CROSSING_JUMP_PX
  || Math.abs(view.right - fade.prevBlackRight) > SCREEN_CROSSING_JUMP_PX
  || Math.abs(view.bottom - fade.prevBlackBottom) > SCREEN_CROSSING_JUMP_PX
  || Math.abs(view.top - fade.prevBlackTop) > SCREEN_CROSSING_JUMP_PX;

const trackFieldCrossing = (fade: FadeState, view: CkViewBlack, hasExtent: boolean): void => {
  const boundsMoved = fade.prevBlackLeft >= 0 && boundsJumped(fade, view);
  if (boundsMoved) fade.fadeTarget = 0;
  fade.prevBlackLeft = view.left;
  fade.prevBlackRight = view.right;
  fade.prevBlackBottom = view.bottom;
  fade.prevBlackTop = view.top;
  const settledOnNewScreen = hasExtent && fade.fadeTarget === 0 && !boundsMoved;
  if (settledOnNewScreen) fade.fadeTarget = 1.0;
};

const restartFade = (fade: FadeState): void => {
  fade.prevBlackLeft = -1;
  fade.prevBlackRight = -1;
  fade.prevBlackBottom = -1;
  fade.prevBlackTop = -1;
  fade.fadeOpacity = 0;
  fade.fadeTarget = 1.0;
};

const stepFadeOpacity = (fade: FadeState, dt: number): void => {
  if (fade.fadeOpacity < fade.fadeTarget) {
    fade.fadeOpacity = Math.min(fade.fadeOpacity + dt * FADE_IN_PER_SECOND, fade.fadeTarget);
  } else if (fade.fadeOpacity > fade.fadeTarget) {
    fade.fadeOpacity = Math.max(fade.fadeOpacity - dt * FADE_OUT_PER_SECOND, fade.fadeTarget);
  }
};

const edgeGlowFade = { trackFieldCrossing, restartFade, stepFadeOpacity };

export { edgeGlowFade };
