// Build-time text patch for the field (src/field.c): the Edge Effect's environment picture (the host's edgeEffect gate,
// CkSetEdgeEnv). Exact matches with an expected count; any mismatch stops the build (the camera-lock.mjs precedent).
// Applied after writeCameraLock, on the patched field.c copy state-patches.mjs wrote under out/gen/state/. core/belthasar
// is never edited.
//  * The host's border glow mirrors this picture (the shown field frame without sprites, captions or boxes) instead of
//    the composited frame, as RotP's glow mirrors its WasmRenderCleanFrame (a PPU render without BG3 and sprites).
//  * With the host's effect off (the default: CkSetEdgeEnv never called) every inserted call returns at its first test,
//    ck_edge_env_on() == 0: nothing is captured, built or allocated, and the frame path is the original.
//  * The code the patches call lives in core/reconnect/ck_edge_env_bands.inc and ck_edge_env.inc (the buffer and the
//    gate: edge_env_reconnect.c).
import { readFileSync, writeFileSync } from 'node:fs';

const LOCK_INC = '#include "ck_camera_lock.inc"\n';
const LOGICAL_HOLD = 'extern int g_ctLogicalHoldApu;';
const PRESENT_FRAME0 = 'static int g_presentFrame0 = 0;';
const PRESENT_CUR = '  CtMotFrame* cur = &g_motBuf[g_motIdx];\n  if (!motion || cur->w != w) cur->valid = 0;\n';
const TALL_MAP = "    if (g_ft) ckTallMap(&f, fb, camx, camy);   /* ChronoKi tall: the bands' map, black past the room */\n";

// [what to find, what to put, how many times it must occur]
const EDGE_ENV_PATCHES = [
  // the band capture's store, after the tall field's and the camera lock's code (g_ft, CK_TALL_MAXT, ck_edge_env_on)
  [LOCK_INC, `${LOCK_INC}#include "ck_edge_env_bands.inc"\n`, 1],
  // the builder, after fieldWideAssemble (wideWipeEdge, g_wipe*, g_motPic, hostWideW, hostTallT are all above it)
  [LOGICAL_HOLD, `#include "ck_edge_env.inc"\n${LOGICAL_HOLD}`, 1],
  [PRESENT_FRAME0, `static void ckEnvPresent(const CtMotFrame* m, const uint8_t* shown, int w);   /* ChronoKi edge env (ck_edge_env.inc) */\n${PRESENT_FRAME0}`, 1],
  // the present: the frame's record is final here (settled by the caller, invalidated above when it is not this picture's)
  [PRESENT_CUR, `${PRESENT_CUR}  ckEnvPresent(cur, fb, w);   /* ChronoKi edge env */\n`, 1],
  // the tall bands: the map ckTallMap just drew, before the sprites and the foreground
  [TALL_MAP, `${TALL_MAP}    if (g_ft) ckEnvBandsCapture(fb, g_fw, g_ft);   /* ChronoKi edge env: the bands before the sprites */\n`, 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/edge-env.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// `state` is writeStatePatches' result, already rewritten by writeTallField and writeCameraLock: field.c's copy is patched in place.
const writeEdgeEnv = (state) => {
  const field = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!field) throw new Error('edge-env: no patched field.c from state-patches.mjs');
  writeFileSync(field, applyPatches('field.c', readFileSync(field, 'utf8'), EDGE_ENV_PATCHES));
  return { patches: EDGE_ENV_PATCHES.length, files: [field] };
};

export { EDGE_ENV_PATCHES, writeEdgeEnv };
