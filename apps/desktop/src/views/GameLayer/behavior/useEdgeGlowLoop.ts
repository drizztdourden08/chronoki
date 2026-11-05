/* @layer renderer-components @kind hook */
import { useRef } from 'react';
import { createEdgeGlowRenderer, envFrameOf, viewBlackOf } from '@chronoki/game-core';
import type { EdgeGlowRenderer } from '@chronoki/game-core';
import { fulfillFrameCapture, setEffectLive } from '@app/game/frame-capture';
import { chronokiCore } from '@app/game/lifecycle';
import { applyGlowViewport } from './apply-glow-viewport';
import { edgeGlowFade } from './edge-glow-fade';
import { initialFade } from './initial-fade';
import { syncEdgeEnv } from './sync-edge-env';
import { useCanvasOverlayLoop } from './useCanvasOverlayLoop';
import { EDGE_GLOW_GATE, EDGE_GLOW_OUTPUT_SCALE, OVERLAY_LIVE_STATUSES } from './useEdgeGlowLoop.constants';
import type { EdgeGlowLoopParams, FadeState } from './useEdgeGlowLoop.type';

const useEdgeGlowLoop = (params: EdgeGlowLoopParams): void => {
  const { status, canvasRef, fxCanvasRef, gates } = params;
  const fadeRef = useRef<FadeState>(initialFade());
  const gatesRef = useRef(gates);
  const envOnRef = useRef(false);
  gatesRef.current = gates;

  useCanvasOverlayLoop<EdgeGlowRenderer>({
    live: OVERLAY_LIVE_STATUSES.includes(status),
    gameCanvasRef: canvasRef,
    fxCanvasRef,
    createRenderer: (fxCanvas) => createEdgeGlowRenderer(fxCanvas, { outputScale: EDGE_GLOW_OUTPUT_SCALE }),
    onStart: () => { fadeRef.current = initialFade(); },
    onFrame: ({ renderer, gameCanvas, fxCanvas, time }) => {
      const fade = fadeRef.current;
      const dt = fade.lastTime > 0 ? (time - fade.lastTime) / 1000 : 0;
      fade.lastTime = time;
      const calls = chronokiCore.calls();
      const view = viewBlackOf(calls, gameCanvas);
      const active = applyGlowViewport(renderer, view, gatesRef.current.has(EDGE_GLOW_GATE), fade);
      gameCanvas.style.visibility = active ? 'hidden' : '';
      fxCanvas.style.visibility = active ? 'visible' : '';
      setEffectLive(active);
      syncEdgeEnv(calls, envOnRef, active);
      if (!active) return;
      edgeGlowFade.stepFadeOpacity(fade, dt);
      renderer.setEffectOpacity(fade.fadeOpacity);
      renderer.render(gameCanvas, time, envFrameOf(calls));
      fulfillFrameCapture(fxCanvas);
    },
    onStop: (gameCanvas, fxCanvas) => {
      setEffectLive(false);
      syncEdgeEnv(chronokiCore.calls(), envOnRef, false);
      gameCanvas.style.visibility = '';
      fxCanvas.style.visibility = '';
    },
  });
};

export { useEdgeGlowLoop };
