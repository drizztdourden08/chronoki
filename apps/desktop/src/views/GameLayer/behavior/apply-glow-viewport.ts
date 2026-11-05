/* @layer renderer-components @kind logic */
import type { CkViewBlack } from '@chronoki/game-core';
import { edgeGlowFade } from './edge-glow-fade';
import { hasBlackExtent } from './has-black-extent';
import type { FadeState, GlowControls } from './useEdgeGlowLoop.type';

const applyGlowViewport = (renderer: GlowControls, view: CkViewBlack | null, edgeEffectOn: boolean, fade: FadeState): boolean => {
  if (!view?.field) {
    if (view) edgeGlowFade.restartFade(fade);
    renderer.setEnabled(false);
    return false;
  }
  const hasExtent = hasBlackExtent(view);
  renderer.setBlackBounds(view.left, view.right, view.bottom, view.top);
  renderer.setMaxBounds(view.left, view.right, view.bottom, view.top);
  edgeGlowFade.trackFieldCrossing(fade, view, hasExtent);
  const active = edgeEffectOn && hasExtent;
  renderer.setEnabled(active);
  return active;
};

export { applyGlowViewport };
