/* @layer bridge-wasm @kind constants */
import type { CkWidescreen } from '../core-config-ini.type';

const CT_WIDE_RATIOS: Record<CkWidescreen, number> = { off: 0, '16:9': 16 / 9, '16:10': 16 / 10, '21:9': 21 / 9 };
const CT_MAX_RENDER_SCALE = 4;
const CT_INTERPOLATED_SCALE = 4;
const CT_FRAME_SIZE_FILE = '/ck_frame_size.txt';

export { CT_FRAME_SIZE_FILE, CT_INTERPOLATED_SCALE, CT_MAX_RENDER_SCALE, CT_WIDE_RATIOS };
