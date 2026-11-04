/* @layer shared-asset-extraction @kind logic */
import { NTILE } from './anim-consts.constants';

const bakeTiles = (vram: Uint8Array): Uint8Array[] =>
  Array.from({ length: NTILE }, (_, t) => vram.slice(t * 32, t * 32 + 32));

export { bakeTiles };
