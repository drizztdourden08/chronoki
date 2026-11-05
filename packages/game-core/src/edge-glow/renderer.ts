/* @layer bridge-wasm @kind logic */
import type { EdgeGlowRenderer, EdgeGlowOptions } from './edge-glow.type';
import { createTexture } from '../webgl/gl-helpers';
import { compilePrograms } from './compile-programs';
import { getUniformLocations } from './get-uniform-locations';
import { create2DFallbackRenderer } from './create-2d-fallback';
import { createEdgeGlowControls } from './create-edge-glow-controls';
import { createEdgeGlowState } from './create-edge-glow-state';
import { disposeEdgeGlow } from './dispose-edge-glow';
import type { EdgeGlowPipeline } from './edge-glow-programs.type';
import { QUAD_TRIANGLES, QUAD_TRIANGLE_VERTICES } from './renderer.constants';
import { renderPassthrough } from './render-passthrough';
import { renderMirrorBlur } from './render-mirror-blur';
import { renderComposite } from './render-composite';
import { resizeEdgeGlow } from './resize-edge-glow';
import { uploadEdgeGlowFrames } from './upload-edge-glow-frames';

const createEdgeGlowRenderer = (glCanvas: HTMLCanvasElement, options: EdgeGlowOptions = {}): EdgeGlowRenderer | null => {
  const glOrNull = glCanvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
  });

  if (!glOrNull) return create2DFallbackRenderer(glCanvas);

  const gl = glOrNull;
  const { blurRadius = 16.0, glowIntensity = 1.0, noiseSpeed = 0.8, noiseScale = 6.0, blurPasses = 3, outputScale = 1 } = options;

  const progs = compilePrograms(gl);
  if (!progs) return null;
  const uniforms = getUniformLocations(gl, progs);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(QUAD_TRIANGLES), gl.STATIC_DRAW);

  const state = createEdgeGlowState(gl, glCanvas.width, glCanvas.height);
  const pipe: EdgeGlowPipeline = {
    gl, glCanvas, progs, uniforms, quadBuffer,
    gameTexture: createTexture(gl, gl.NEAREST),
    draw: { mode: gl.TRIANGLES, count: QUAD_TRIANGLE_VERTICES },
    settings: { blurRadius, glowIntensity, noiseSpeed, noiseScale, blurPasses },
  };

  const resize = (w: number, h: number): void => resizeEdgeGlow(pipe, state, w, h);

  const render = (gameCanvas: HTMLCanvasElement, time: number): void => {
    if (gl.isContextLost()) return;
    const width = gameCanvas.width * outputScale;
    const height = gameCanvas.height * outputScale;
    if (width !== state.width || height !== state.height) resize(width, height);
    const mirrorSrcTexture = uploadEdgeGlowFrames(pipe, gameCanvas);
    if (!state.enabled) {
      renderPassthrough(pipe, state);
      return;
    }
    renderMirrorBlur(pipe, state, mirrorSrcTexture, false);
    renderComposite(pipe, state, time / 1000.0);
  };

  const dispose = (): void => disposeEdgeGlow(pipe, state);

  return { render, resize, dispose, ...createEdgeGlowControls(state) };
};

export { createEdgeGlowRenderer };
