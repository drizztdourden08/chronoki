/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import type { CanvasOverlayLoopConfig, Disposable } from './useCanvasOverlayLoop.type';

const useCanvasOverlayLoop = <R extends Disposable>(config: CanvasOverlayLoopConfig<R>): void => {
  const { live, gameCanvasRef, fxCanvasRef, createRenderer, onStart, onFrame, onStop } = config;

  useEffect(() => {
    if (!live) return;
    const gameCanvas = gameCanvasRef.current;
    const fxCanvas = fxCanvasRef.current;
    if (!gameCanvas || !fxCanvas) return;
    const renderer = createRenderer(fxCanvas);
    if (!renderer) return;

    let rafId = 0;
    onStart();
    const loop = (time: number) => {
      onFrame({ renderer, gameCanvas, fxCanvas, time });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      onStop(gameCanvas, fxCanvas);
      renderer.dispose();
    };
  }, [live]);
};

export { useCanvasOverlayLoop };
