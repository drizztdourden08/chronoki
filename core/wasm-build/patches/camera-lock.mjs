// Build-time text patch for the field (src/field.c): "Lock Camera to View", [video] camera_lock (ck_camera_lock()).
// Exact matches with an expected count; any mismatch stops the build (the tall-field.mjs precedent). Applied right after
// writeTallField, on the patched field.c copy state-patches.mjs wrote under out/gen/state/. core/belthasar is never edited.
//  * With the option off (or no tall rows, or a scene that is not the field), every inserted branch is the original code:
//    the shift is 0, fillHold runs as before, the window rows shift by fillHold alone, the widescreen camera is as it was.
//  * The code the patches call lives in core/reconnect/ck_camera_lock.inc.
import { readFileSync, writeFileSync } from 'node:fs';

const FIELD_SCENE = '!battlePhase && !battleTest && !gameOver && !inWorld && f.vm';

const FILL_HOLD = '    if (g_hostInteractive && CtSettingsGet()->fillBottomLines && f.vm && !gameOver) {\n      int last = f.my1 - 1 - camy;';
const LOCK_CAM = `    const int ckLockOn = ${FIELD_SCENE};   /* ChronoKi camera lock */\n`
  + '    const int ckLockDy = ckLockOn ? ckLockCam(&f, &camy, hostTallT()) : 0;   /* the origin kept inside the room; the map and objects move together */\n';

const WIDE_CAM = '    if (wideW > CAMW && f.vm) wideX = fieldWideViewX(&f, wideW, camx);';
const WIDE_CAM_LOCK = '    if (wideW > CAMW && f.vm && ck_camera_lock()) wideX = fieldWideViewX(&f, wideW, camx);'
  + ' ckLockExtents(&f, wideW, wideX, camx, camy, hostTallT(), ckLockOn);   /* ChronoKi camera lock: black extents */';

const BG_WIN = '    if (g_bgWinOn && !battlePhase) fillWinRowsHold(g_bgWinL, g_bgWinR, fillHold);';
const COL_WIN = '    if (g_colWinOn && !battlePhase) fillWinRowsHold(g_colWinL, g_colWinR, fillHold);';
const shifted = (line) => line.replace('fillHold)', 'fillHold - ckLockDy)').replace('fillWinRowsHold(', 'ckWinRowsShift(');

const HOST_INC = '#include "ck_tall_host.inc"\n#include "ck_tall_ow.inc"\n';
const PRESENT_BEGIN = '  ckTallPresentBegin();   /* ChronoKi tall */\n';
const FIELD_INC = '#include "ck_tall_field.inc"\n';

// [what to find, what to put, how many times it must occur]
const LOCK_PATCHES = [
  [FIELD_INC, `${FIELD_INC}#include "ck_camera_lock.inc"\n`, 1],
  [HOST_INC, `static void ckLockPresentBegin(void);   /* ChronoKi camera lock (ck_camera_lock.inc) */\n${HOST_INC}`, 1],
  [PRESENT_BEGIN, `${PRESENT_BEGIN}  ckLockPresentBegin();   /* ChronoKi camera lock */\n`, 1],
  [FILL_HOLD, `${LOCK_CAM}${FILL_HOLD.replace('!gameOver) {', '!gameOver && !ckLockDy) {')}`, 1],
  [BG_WIN, shifted(BG_WIN), 1],
  [COL_WIN, shifted(COL_WIN), 1],
  [WIDE_CAM, WIDE_CAM_LOCK, 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/camera-lock.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// `state` is writeStatePatches' result, already rewritten by writeTallField: field.c's copy is patched in place.
const writeCameraLock = (state) => {
  const field = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!field) throw new Error('camera-lock: no patched field.c from state-patches.mjs');
  writeFileSync(field, applyPatches('field.c', readFileSync(field, 'utf8'), LOCK_PATCHES));
  return { patches: LOCK_PATCHES.length, files: [field] };
};

export { LOCK_PATCHES, writeCameraLock };
