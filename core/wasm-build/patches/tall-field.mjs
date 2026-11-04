// Build-time text patch for the field (src/field.c): true tall rendering, more than 224 lines, band rows above and below the
// view (docs/plans/tall-rendering-engine-patch.md, phase T1: the field's scenes). Exact matches with an expected count; any
// mismatch stops the build (the mixer-gains / state-patches precedent). The import is never edited: this rewrites the copy
// state-patches.mjs already wrote under out/gen/state/, which replaces src/field.c in the game module only.
//  * The gate: tall_lines in the ini (settings_reconnect.c, ck_tall_lines()); 224 = off. hostTallT() (ck_tall_host.inc) is 0
//    headless, with the widescreen, or with the option off, and then g_ft and g_ckTallT stay 0 and every patched site is the
//    original code: the inserted branches test g_ft / g_ckTallT first, the offsets are + 0, the sizes only grow buffers.
//  * The compositor draws into buffers sized for the cap with its pointers at the view's first row, so a band row is a row
//    index below 0 or from 224 on (ck_tall_defs.inc); the view's 224 rows are copied back to the frame at the compose's end,
//    the overlays draw on them as before, and the shown frame is the bands around them (ckTallAssemble).
//  * The code the patches call lives in core/reconnect (ck_tall_defs.inc, ck_tall_host.inc, ck_tall_field.inc).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PLOT = '  if (x >= 0 && x < g_fw && y >= 0 && y < CAMH) { size_t o = ((size_t)y * g_fw + x) * 3; fb[o] = r; fb[o + 1] = g; fb[o + 2] = b;\n';
const PLOT_BAND = '  if (g_ft && x >= 0 && x < g_fw && (y < 0 || y >= CAMH) && y >= -g_ft && y < CAMH + g_ft) {   /* ChronoKi tall: a band row */\n'
  + '    ptrdiff_t o = ((ptrdiff_t)y * g_fw + x) * 3; fb[o] = r; fb[o + 1] = g; fb[o + 2] = b; return; }\n';

const SPR_MARK = '      if (px >= 0 && px < g_fw && py >= 0 && py < CAMH) {\n        nplot++;\n';
const SPR_BAND = '      if (g_ft && px >= 0 && px < g_fw && (py < 0 || py >= CAMH) && py >= -g_ft && py < CAMH + g_ft) {   /* ChronoKi tall */\n'
  + '        if (front) front[py * g_fw + px] = (uint8_t)(p == 3);\n'
  + '        if (allMask) allMask[py * g_fw + px] = 1; }\n';

const FRONT = '  uint8_t* front = (uint8_t*)malloc((size_t)FIELD_WMAX * CAMH);   // per-frame: pixels a prio-3 sprite half covers\n';
const PMASK = '  uint8_t* pmask = (uint8_t*)malloc((size_t)FIELD_WMAX * CAMH);   // per-frame: every player pixel (stencil exclusion)\n';

const BEGIN = '    g_fw = wideW; g_fx = wideX;\n';
const BEGIN_TALL = '    g_ft = g_ckTallT = (wideW == CAMW && !battlePhase && !battleTest && !gameOver && !inWorld && f.vm) ? hostTallT() : 0;   /* ChronoKi tall */\n'
  + '    if (g_ft) fb = g_wfb + (size_t)g_ft * CAMW * 3;\n'
  + '    front = ckFront0 + (size_t)g_ft * CAMW; pmask = ckPmask0 + (size_t)g_ft * CAMW;\n';

const MEMSETS = '    memset(fb, 0, (size_t)g_fw * CAMH * 3);\n    memset(front, 0, (size_t)g_fw * CAMH);\n    memset(pmask, 0, (size_t)g_fw * CAMH);\n';
const MEMSETS_TALL = '    memset(fb - (size_t)g_ft * g_fw * 3, 0, (size_t)g_fw * (CAMH + 2 * g_ft) * 3);   /* ChronoKi tall: + the bands (g_ft 0: as before) */\n'
  + '    memset(front - (size_t)g_ft * g_fw, 0, (size_t)g_fw * (CAMH + 2 * g_ft));\n'
  + '    memset(pmask - (size_t)g_ft * g_fw, 0, (size_t)g_fw * (CAMH + 2 * g_ft));\n';

const BASE = '        memcpy(fb + ((size_t)y * g_fw + x) * 3, f.base + fieldBaseAt(&f, camx + x + arenaD[y * 4], camy + y + arenaD[y * 4 + 1]) * 3, 3);\n';

const FG_PRIO = '          if (!f.prio[bo]) continue;\n          if (front[(size_t)y * g_fw + x]) { fgSkipped++; continue; }';
const FG_PRIO_TALL = '          if (!f.prio[bo]) continue;\n          if (g_ft && ckTallBlackRow(&f, camy, y)) continue;   /* ChronoKi tall: past the room */\n'
  + '          if (front[(size_t)y * g_fw + x]) { fgSkipped++; continue; }';

const BG3 = '    if (bg3Plane)                                      // the caption plane\'s priority-1 cells: the front layer\n';

const END = '      fb = fbView; camx += wideX;\n    }\n    g_fw = CAMW; g_fx = 0;\n';
const END_TALL = '      fb = fbView; camx += wideX;\n    }\n'
  + '    if (g_ft) { memcpy(fbView, fb, (size_t)CAMW * CAMH * 3); fb = fbView; }   /* ChronoKi tall: the view rows back; the bands stay in g_wfb */\n'
  + '    g_ft = 0; front = ckFront0; pmask = ckPmask0;\n'
  + '    g_fw = CAMW; g_fx = 0;\n';

const WIDE_BRANCH = '      if (wideW > CAMW && !gwN && !(seqId >= 0 && seqOpen != 0)) {   // the widescreen: its sides around the finished view\n';
const TALL_BRANCH = '      if (g_ckTallT && !gwN && seqId < 0 && ldrCur < 0 && nameId < 0 && !atbGate) {   /* ChronoKi tall: the bands around the finished view */\n'
  + '        ckTallAssemble(g_wide, g_wfb, fb, g_ckTallT, motBright);\n'
  + '        shown = g_wide; shownW = CAMW; mot->valid = 0; g_ckShowH = CAMH + 2 * g_ckTallT;\n'
  + '      } else\n';

const PRESENT = '      hostPresentMot(pr, shown, shownW, mot->valid); }\n';

// [what to find, what to put, how many times it must occur]
const TALL_PATCHES = [
  // the definitions and the buffers sized for the cap
  ['#define FIELD_WMAX CT_MOT_W\n', '#define FIELD_WMAX CT_MOT_W\n#include "ck_tall_defs.inc"\n', 1],
  ['static uint8_t g_wfb[FIELD_WMAX * CAMH * 3];', 'static uint8_t g_wfb[FIELD_WMAX * CK_FIELD_HMAX * 3];', 1],
  ['static uint8_t g_wide[FIELD_WMAX * CAMH * 3];', 'static uint8_t g_wide[FIELD_WMAX * CK_FIELD_HMAX * 3];', 1],
  // the gate and the present: every picture at one size while tall is on, 1x, no frames between
  ['  g_hostLastUp = pic; g_hostLastUpW = w; g_hostLastUpH = h;\n}\n',
   '  g_hostLastUp = pic; g_hostLastUpW = w; g_hostLastUpH = h;\n}\n#include "ck_tall_host.inc"\n', 1],
  ['static void hostUploadPictureAt(CtPresenter* pr, const uint8_t* fb, int w, int t, int interp) {\n',
   'static void hostUploadPictureAt(CtPresenter* pr, const uint8_t* fb, int w, int t, int interp) {\n  if (ckTallUpload(pr, fb, w)) return;   /* ChronoKi tall */\n', 1],
  ['  if (!g_hostInteractive || g_noPace || !st->interpolate || getenv("CT_OVERLAY_SHOT")) return 0;\n',
   '  if (!g_hostInteractive || g_noPace || !st->interpolate || getenv("CT_OVERLAY_SHOT")) return 0;\n  if (hostTallT()) return 0;   /* ChronoKi tall: no frames between (T1) */\n', 1],
  // the sprites in the bands
  [PLOT, PLOT_BAND + PLOT, 1],
  [SPR_MARK, SPR_BAND + SPR_MARK, 1],
  // the band rows' map (after fieldBaseAt)
  ['  y %= f->H; if (y < 0) y += f->H;\n  return (size_t)y * (size_t)f->W + (size_t)x;\n}\n',
   '  y %= f->H; if (y < 0) y += f->H;\n  return (size_t)y * (size_t)f->W + (size_t)x;\n}\n#include "ck_tall_field.inc"\n', 1],
  // the compositor's masks sized for the cap, their base pointers kept
  [FRONT, FRONT.replace('(size_t)FIELD_WMAX * CAMH', '(size_t)FIELD_WMAX * CK_FIELD_HMAX') + '  uint8_t* const ckFront0 = front;   /* ChronoKi tall */\n', 1],
  [PMASK, PMASK.replace('(size_t)FIELD_WMAX * CAMH', '(size_t)FIELD_WMAX * CK_FIELD_HMAX') + '  uint8_t* const ckPmask0 = pmask;\n', 1],
  [BEGIN, BEGIN + BEGIN_TALL, 1],
  [MEMSETS, MEMSETS_TALL, 1],
  [BASE, BASE + '    if (g_ft) ckTallMap(&f, fb, camx, camy);   /* ChronoKi tall: the bands\' map, black past the room */\n', 1],
  // the objects the ROM has not latched, in the bands (the widescreen's own objects, vertically)
  ['    if (wideW > CAMW && f.vm && !battleCompose)\n', '    if ((wideW > CAMW || g_ft) && f.vm && !battleCompose)\n', 1],
  ['        if (sx > wideX - 24 && sx < wideX + CAMW + 24 && !shown) continue;\n',
   '        if (sx > wideX - 24 && sx < wideX + CAMW + 24 && !shown && !(g_ft && (sy <= -16 || sy >= CAMH + 48))) continue;\n', 1],
  ['        if (sx < -48 || sx >= wideW + 48 || sy < -16 || sy >= CAMH + 64) continue;\n',
   '        if (sx < -48 || sx >= wideW + 48 || sy < -16 - g_ft || sy >= CAMH + 64 + g_ft) continue;\n', 1],
  // the foreground: the view's blanked rows past the room stay black, the bands get theirs
  [FG_PRIO, FG_PRIO_TALL, 1],
  [BG3, '    if (g_ft && f.prio && !dbg.noFg) ckTallFg(&f, fb, front, camx, camy);   /* ChronoKi tall */\n' + BG3, 1],
  [END, END_TALL, 1],
  // the IRQ's blank lines are drawn in a tall picture (as with the bottom lines drawn)
  ['        !(g_hostInteractive && CtSettingsGet()->fillBottomLines)) {\n',
   '        !(g_hostInteractive && (CtSettingsGet()->fillBottomLines || g_ckTallT))) {\n', 1],
  [WIDE_BRANCH, TALL_BRANCH + WIDE_BRANCH, 1],
  [PRESENT, `${PRESENT}    g_ckTallT = 0;\n`, 1],
  ['free(front); free(pmask);', 'free(ckFront0); free(ckPmask0);', 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/tall-field.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// `state` is writeStatePatches' result; field.c's patched copy is rewritten in place. Returns the patch count.
const writeTallField = (state) => {
  const path = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!path) throw new Error('tall-field: no patched field.c from state-patches.mjs');
  writeFileSync(path, applyPatches('field.c', readFileSync(path, 'utf8'), TALL_PATCHES));
  return { patches: TALL_PATCHES.length, file: join(path) };
};

export { TALL_PATCHES, writeTallField };
