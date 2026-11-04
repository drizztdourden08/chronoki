/* @layer renderer-components @kind constants */
const GAME_LAYER_LABEL = 'ChronoKi game screen';

const GAME_LAYER_ERROR_TITLE = 'The game stopped';

const LEGACY_STRETCH_GATE = 'scaleStretch';

const CANVAS_WIDTH_VAR = '--canvas-w';

const CANVAS_HEIGHT_VAR = '--canvas-h';

const CANVAS_CLIP_X_VAR = '--canvas-clip-x';

const CANVAS_CLIP_Y_VAR = '--canvas-clip-y';

const CANVAS_VARS: readonly string[] = [CANVAS_WIDTH_VAR, CANVAS_HEIGHT_VAR, CANVAS_CLIP_X_VAR, CANVAS_CLIP_Y_VAR];

const TITLEBAR_HEIGHT = 40;

const STAGE_SETTLE_MS = 300;

const STAGE_SETTLE_MAX_MS = 2500;

export {
  CANVAS_CLIP_X_VAR, CANVAS_CLIP_Y_VAR, CANVAS_HEIGHT_VAR, CANVAS_VARS, CANVAS_WIDTH_VAR, GAME_LAYER_ERROR_TITLE, GAME_LAYER_LABEL,
  LEGACY_STRETCH_GATE, STAGE_SETTLE_MAX_MS, STAGE_SETTLE_MS, TITLEBAR_HEIGHT,
};
