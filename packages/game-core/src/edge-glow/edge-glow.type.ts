/* @layer bridge-wasm @kind types */
interface EdgeGlowRenderer {
  render(gameCanvas: HTMLCanvasElement, time: number): void;
  resize(width: number, height: number): void;
  setEnabled(enabled: boolean): void;
  setBlackBounds(left: number, right: number, bottom: number, top: number): void;
  setMaxBounds(left: number, right: number, bottom: number, top: number): void;
  setEffectOpacity(opacity: number): void;
  setPixelateParams(size: number, divisor: number, exponent: number): void;
  dispose(): void;
}

interface EdgeGlowOptions {
  blurRadius?: number;
  glowIntensity?: number;
  noiseSpeed?: number;
  noiseScale?: number;
  blurPasses?: number;
  outputScale?: number;
}

export type { EdgeGlowRenderer, EdgeGlowOptions };
