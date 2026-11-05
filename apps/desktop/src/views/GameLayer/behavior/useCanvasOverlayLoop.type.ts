/* @layer renderer-components @kind types */
import type { RefObject } from 'react';

interface Disposable {
  dispose: () => void;
}

interface OverlayFrame<R extends Disposable> {
  renderer: R;
  gameCanvas: HTMLCanvasElement;
  fxCanvas: HTMLCanvasElement;
  time: number;
}

interface CanvasOverlayLoopConfig<R extends Disposable> {
  live: boolean;
  gameCanvasRef: RefObject<HTMLCanvasElement | null>;
  fxCanvasRef: RefObject<HTMLCanvasElement | null>;
  createRenderer: (fxCanvas: HTMLCanvasElement) => R | null;
  onStart: () => void;
  onFrame: (frame: OverlayFrame<R>) => void;
  onStop: (gameCanvas: HTMLCanvasElement, fxCanvas: HTMLCanvasElement) => void;
}

export type { CanvasOverlayLoopConfig, Disposable, OverlayFrame };
