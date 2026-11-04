/* @layer bridge-wasm @kind constants */
import type { CkWidescreen } from '../core-config-ini.type';

/* Belthasar's field.c hostWideW: the picture is 224 lines at the aspect, square pixels (the ini says aspect=pixel),
   rounded to an even width, at most CT_MOT_W (motion.h). */
const CT_WIDE_RATIOS: Record<CkWidescreen, number> = { off: 0, '16:9': 16 / 9, '16:10': 16 / 10, '21:9': 21 / 9 };
const CT_FRAME_MAX_WIDTH = 544;
const CT_MAX_RENDER_SCALE = 4;
/* hostUploadPictureAt: a frame between two frames is drawn at 4x when the render scale is 1x. */
const CT_INTERPOLATED_SCALE = 4;
/* Read by the core's presenter (core/reconnect/present_reconnect.c): the size every picture is fitted to. */
const CT_FRAME_SIZE_FILE = '/ck_frame_size.txt';

export { CT_FRAME_MAX_WIDTH, CT_FRAME_SIZE_FILE, CT_INTERPOLATED_SCALE, CT_MAX_RENDER_SCALE, CT_WIDE_RATIOS };
