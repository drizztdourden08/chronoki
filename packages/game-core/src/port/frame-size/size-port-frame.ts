/* @layer bridge-wasm @kind logic */
import { CHRONOKI_VIDEO } from '../chronoki-port-definition.constants';
import { CT_FRAME_SIZE_FILE } from './frame-size.constants';
import type { CkFrameSize } from './frame-size.type';

/* port-kit reads the framebuffer at the port's fixed video size, so the size is set for the session about to start
   (the core reads the same size from the returned file and fits every picture to it). */
const sizePortFrame = ({ width, height }: CkFrameSize): Record<string, string> => {
  CHRONOKI_VIDEO.width = width;
  CHRONOKI_VIDEO.height = height;
  return { [CT_FRAME_SIZE_FILE]: `${width} ${height}\n` };
};

export { sizePortFrame };
