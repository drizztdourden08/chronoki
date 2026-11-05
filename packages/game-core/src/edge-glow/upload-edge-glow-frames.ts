/* @layer bridge-wasm @kind logic */
import type { EdgeGlowPipeline } from './edge-glow-programs.type';

const uploadEdgeGlowFrames = (pipe: EdgeGlowPipeline, gameCanvas: HTMLCanvasElement): WebGLTexture => {
  const { gl, gameTexture } = pipe;
  gl.bindTexture(gl.TEXTURE_2D, gameTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gameCanvas);
  return gameTexture;
};

export { uploadEdgeGlowFrames };
