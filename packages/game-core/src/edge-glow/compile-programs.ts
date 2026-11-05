/* @layer bridge-wasm @kind logic */
import { createProgram } from '../webgl/gl-helpers';
import { BLUR_H_FRAG } from './blur-h-frag';
import { BLUR_V_FRAG } from './blur-v-frag';
import { COMPOSITE_FRAG } from './composite-frag';
import type { EdgeGlowPrograms } from './edge-glow-programs.type';
import { FULLSCREEN_VERT } from './fullscreen-vert';
import { MIRROR_FRAG } from './mirror-frag';

const compilePrograms = (gl: WebGLRenderingContext): EdgeGlowPrograms | null => {
  const mirror = createProgram(gl, FULLSCREEN_VERT, MIRROR_FRAG);
  const blurH = createProgram(gl, FULLSCREEN_VERT, BLUR_H_FRAG);
  const blurV = createProgram(gl, FULLSCREEN_VERT, BLUR_V_FRAG);
  const composite = createProgram(gl, FULLSCREEN_VERT, COMPOSITE_FRAG);
  if (!mirror || !blurH || !blurV || !composite) return null;
  return { mirror, blurH, blurV, composite };
};

export { compilePrograms };
