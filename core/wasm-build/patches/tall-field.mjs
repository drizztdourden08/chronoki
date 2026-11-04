// Build-time text patch for the field (src/field.c), the overworld's pieces (src/world.c) and the title (src/title_intro.c):
// true tall rendering, more than 224 lines, band rows above and below the view (docs/plans/tall-rendering-engine-patch.md).
// Exact matches with an expected count; any mismatch stops the build (the mixer-gains / state-patches precedent). The import
// is never edited: this rewrites the copies state-patches.mjs already wrote under out/gen/state/ (field.c, world.c), and
// writes a copy of title_intro.c beside them, which replace the originals in the game module only (the oracle builds the
// originals).
//  * The gate: tall_lines in the ini (settings_reconnect.c, ck_tall_lines()); 224 = off. hostTallT() (ck_tall_host.inc) is 0
//    headless or with the option off, and then every patched site is the original code: the inserted branches test
//    hostTallT() / g_ft / g_ckTallT / g_owBandDy first, the offsets are + 0, the sizes only grow buffers, and the wrap
//    returns the picture it was given. No save-state section changes: the bands are not state.
//  * The wrap: every scene keeps its 224-line picture (wide, k x, the frames between) through the whole pipeline; the upload
//    (hostUpload) wraps it in band rows, w x (h + 2 T k), from the title's mode 7, the band store a producer filled for the
//    frame, or black. Producers: the field compositor (its bands drawn in the same pass, T1), the overworld (two partial
//    composes, T2), a battle (the arena map, T3), the title (mode 7 rendered for the band rows, T4).
//  * The code the patches call lives in core/reconnect (ck_tall_defs.inc, ck_tall_host.inc, ck_tall_field.inc,
//    ck_tall_ow.inc, ck_tall_title.inc).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const PLOT = '  if (x >= 0 && x < g_fw && y >= 0 && y < CAMH) { size_t o = ((size_t)y * g_fw + x) * 3; fb[o] = r; fb[o + 1] = g; fb[o + 2] = b;\n';
const PLOT_BAND = '  if (g_ft && x >= 0 && x < g_fw && (y < 0 || y >= CAMH) && y >= -g_ft && y < CAMH + g_ft) {   /* ChronoKi tall: a band row */\n'
  + '    ptrdiff_t o = ((ptrdiff_t)y * g_fw + x) * 3; fb[o] = r; fb[o + 1] = g; fb[o + 2] = b; return; }\n';

const SPR_MARK = '      if (px >= 0 && px < g_fw && py >= 0 && py < CAMH) {\n        nplot++;\n';
const SPR_BAND = '      if (g_ft && px >= 0 && px < g_fw && (py < 0 || py >= CAMH) && py >= -g_ft && py < CAMH + g_ft) {   /* ChronoKi tall */\n'
  + '        if (front) front[py * g_fw + px] = (uint8_t)(p == 3);\n'
  + '        if (allMask) allMask[py * g_fw + px] = 1; }\n';

const FRONT = '  uint8_t* front = (uint8_t*)malloc((size_t)FIELD_WMAX * CAMH);   // per-frame: pixels a prio-3 sprite half covers\n';
const PMASK = '  uint8_t* pmask = (uint8_t*)malloc((size_t)FIELD_WMAX * CAMH);   // per-frame: every player pixel (stencil exclusion)\n';

// the field compositor: tall with or without the widescreen (g_fw = its width); not a battle, game over, the overworld
const BEGIN = '    g_fw = wideW; g_fx = wideX;\n';
const BEGIN_TALL = '    g_ft = g_ckTallT = (!battlePhase && !battleTest && !gameOver && !inWorld && f.vm) ? hostTallT() : 0;   /* ChronoKi tall */\n'
  + '    if (g_ft) fb = g_wfb + (size_t)g_ft * g_fw * 3;\n'
  + '    front = ckFront0 + (size_t)g_ft * g_fw; pmask = ckPmask0 + (size_t)g_ft * g_fw;\n';

const MEMSETS = '    memset(fb, 0, (size_t)g_fw * CAMH * 3);\n    memset(front, 0, (size_t)g_fw * CAMH);\n    memset(pmask, 0, (size_t)g_fw * CAMH);\n';
const MEMSETS_TALL = '    memset(fb - (size_t)g_ft * g_fw * 3, 0, (size_t)g_fw * (CAMH + 2 * g_ft) * 3);   /* ChronoKi tall: + the bands (g_ft 0: as before) */\n'
  + '    memset(front - (size_t)g_ft * g_fw, 0, (size_t)g_fw * (CAMH + 2 * g_ft));\n'
  + '    memset(pmask - (size_t)g_ft * g_fw, 0, (size_t)g_fw * (CAMH + 2 * g_ft));\n';

const BASE = '        memcpy(fb + ((size_t)y * g_fw + x) * 3, f.base + fieldBaseAt(&f, camx + x + arenaD[y * 4], camy + y + arenaD[y * 4 + 1]) * 3, 3);\n';

const FG_PRIO = '          if (!f.prio[bo]) continue;\n          if (front[(size_t)y * g_fw + x]) { fgSkipped++; continue; }';
const FG_PRIO_TALL = '          if (!f.prio[bo]) continue;\n          if (g_ft && ckTallBlackRow(&f, camy, y)) continue;   /* ChronoKi tall: past the room */\n'
  + '          if (front[(size_t)y * g_fw + x]) { fgSkipped++; continue; }';

const BG3 = '    if (bg3Plane)                                      // the caption plane\'s priority-1 cells: the front layer\n';

// the compose's end: the view's rows back to the frame (the widescreen already copied them); the tall picture stays in
// g_wfb, its row 0 the top band's first, for the producer below and the widescreen's assembly
const END = '      fb = fbView; camx += wideX;\n    }\n    g_fw = CAMW; g_fx = 0;\n';
const END_TALL = '      fb = fbView; camx += wideX;\n    }\n'
  + '    if (g_ft && fb != fbView) { memcpy(fbView, fb, (size_t)CAMW * CAMH * 3); fb = fbView; }   /* ChronoKi tall */\n'
  + '    g_ckTallW = g_fw; g_ft = 0; front = ckFront0; pmask = ckPmask0;\n'
  + '    g_fw = CAMW; g_fx = 0;\n';

// the field's producer, at the present: not under a stage, a gate, the loader, naming or the ATB selector (black there)
const WIDE_BRANCH = '      if (wideW > CAMW && !gwN && !(seqId >= 0 && seqOpen != 0)) {   // the widescreen: its sides around the finished view\n';
const TALL_BRANCH = '      if (g_ckTallT && !gwN && seqId < 0 && ldrCur < 0 && nameId < 0 && !atbGate) ckTallFieldBands(g_wfb, g_ckTallW, g_ckTallT, motBright);   /* ChronoKi tall */\n';

const PRESENT = '      hostPresentMot(pr, shown, shownW, mot->valid); }\n';

// the battle's producer: after the widescreen arena (g_bwW / g_bwX this frame's, 0 when not wide)
const BATTLE = '          g_bwW = bwW; g_bwX = bx0;\n        } }\n';
const BATTLE_TALL = '      if (hostTallT() && battlePhase && !defeatHold && f.base)   /* ChronoKi tall: the arena in the band rows */\n'
  + '        ckTallBattleBands(&f, camx, camy, arenaD, arenaRow, arenaShift, g_bwW > CAMW ? g_bwW : CAMW, g_bwW > CAMW ? g_bwX : 0,\n'
  + '                          hostTallT(), (battleInidisp & 0x80) ? 0 : (battleInidisp & 0x0F), &liveHost);\n';

// the overworld: its compositor's rows and OBJ lines moved for a band compose (g_owBandDy / g_owY0..g_owY1, 0 / 0..224
// otherwise: the original loops)
const OW_PROTO = 'static void worldObjLinePieces(const World* w, int y, uint8_t* pix, uint8_t* pri, int16_t* oi, int W, int X0);\n';
const OW_ROW = '    int row = y - P->y; if (row < 0 || row >= size) continue;';
const OW_LATCH = '  uint8_t hdmaEn = 0, hwh0, hwh1; CtWorldNmiLatch(&hdmaEn, &hwh0, &hwh1);\n';
const OW_LOOP_BG = '  for (int y = 0; y < CAMH; y++) {\n    uint8_t* dst = fb + (size_t)y * W * 3;\n    uint16_t bg2hL';
const OW_LOOP_OBJ = '    for (int y = 0; y < CAMH; y++) {\n      if (X0 > 0) worldObjLinePieces(';
const OW_LOOP_CLOUD = '    for (int y = 0; y < CAMH; y++) {\n      uint8_t* dst = fb + (size_t)y * W * 3;\n      for (int x = 0; x < W; x++) {\n        int pr, pb3;';
const OW_LOOP_FIX = '    for (int y = 0; y < CAMH; y++) {\n      uint8_t* dst = fb + (size_t)y * W * 3;\n      for (int x = 0; x < W; x++) {\n        int L = mlayer[y * W + x];';
const OW_WIN1 = '  owWindow1Pass(w, fb, owSubFb, W, X0);\n}';
const OW_LOOP = '(int y = g_owY0; y < g_owY1; y++) {';
// ...and its producer: the bands composed before the frame's own picture (they share CtWorldTilemapView's picture-only map,
// which the widescreen's compose rebuilds next), ended at the present with the frame's brightness
const OW_MOT = '      CtMotFrame* owMot = &g_motBuf[g_motIdx];\n';
const OW_BANDS = '      const int ckOwBands = hostTallT() && wd.wram && !owLoading && !(owGaugePh >= 2 && owGaugePh <= 5) && !(owMapPh >= 2 && owMapPh <= 5)\n'
  + '                            && ckTallOwBands(&wd, owWideW, owWideX, hostTallT());   /* ChronoKi tall */\n';
const OW_PRESENT = '        hostPresentMot(pr, shown, shownW, owMot->valid); }';

// [what to find, what to put, how many times it must occur]
const TALL_PATCHES = [
  // the definitions and the buffers sized for the cap
  ['#define FIELD_WMAX CT_MOT_W\n', '#define FIELD_WMAX CT_MOT_W\n#include "ck_tall_defs.inc"\n', 1],
  ['static uint8_t g_wfb[FIELD_WMAX * CAMH * 3];', 'static uint8_t g_wfb[FIELD_WMAX * CK_FIELD_HMAX * 3];', 1],
  ['static uint8_t g_wide[FIELD_WMAX * CAMH * 3];', 'static uint8_t g_wide[FIELD_WMAX * CK_FIELD_HMAX * 3];', 1],
  // the wrap: every upload goes up with its band rows; the present takes the bands its frame stored
  ['static void hostUpload(CtPresenter* pr, const uint8_t* pic, int w, int h) {\n  CtPresentSetPicSize(pr, w, h);',
   'static const uint8_t* ckTallWrap(const uint8_t* pic, int w, int* h);   /* ChronoKi tall (ck_tall_host.inc) */\n'
   + 'static void hostUpload(CtPresenter* pr, const uint8_t* pic, int w, int h) {\n  pic = ckTallWrap(pic, w, &h);\n  CtPresentSetPicSize(pr, w, h);', 1],
  ['static void hostUploadPictureAt(CtPresenter* pr, const uint8_t* fb, int w, int t, int interp) {\n',
   '#include "ck_tall_host.inc"\n#include "ck_tall_ow.inc"\n'
   + 'static void hostUploadPictureAt(CtPresenter* pr, const uint8_t* fb, int w, int t, int interp) {\n  g_ckUpT = t;   /* ChronoKi tall */\n', 1],
  ['static void hostPresentMot(CtPresenter* pr, const uint8_t* fb, int w, int motion) {\n  static int frameNo = INT_MIN;\n',
   'static void hostPresentMot(CtPresenter* pr, const uint8_t* fb, int w, int motion) {\n  static int frameNo = INT_MIN;\n  ckTallPresentBegin();   /* ChronoKi tall */\n', 1],
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
  // the motion record's picture and the widescreen's assembly read the view's rows of the tall picture
  ['    if (mot->valid) memcpy(g_motPic, wideW > CAMW ? g_wfb : fb, (size_t)wideW * CAMH * 3);',
   '    if (mot->valid) memcpy(g_motPic, wideW > CAMW ? g_wfb + (size_t)g_ckTallT * wideW * 3 : fb, (size_t)wideW * CAMH * 3);', 1],
  ['        fieldWideAssemble(g_wide, g_wfb, fb, wideW, wideX, wideXc, motBright, fieldBlank, mot);',
   '        fieldWideAssemble(g_wide, g_wfb + (size_t)g_ckTallT * wideW * 3, fb, wideW, wideX, wideXc, motBright, fieldBlank, mot);', 1],
  // the IRQ's blank lines are drawn in a tall picture (as with the bottom lines drawn)
  ['        !(g_hostInteractive && CtSettingsGet()->fillBottomLines)) {\n',
   '        !(g_hostInteractive && (CtSettingsGet()->fillBottomLines || g_ckTallT))) {\n', 1],
  [WIDE_BRANCH, TALL_BRANCH + WIDE_BRANCH, 1],
  [PRESENT, `${PRESENT}    g_ckTallT = 0;\n`, 1],
  ['free(front); free(pmask);', 'free(ckFront0); free(ckPmask0);', 1],
  // T3: the battle
  [BATTLE, BATTLE + BATTLE_TALL, 1],
  // T2: the overworld
  [OW_PROTO, `static int g_owBandDy = 0, g_owY0 = 0, g_owY1 = CAMH;   /* ChronoKi tall: a band compose (ck_tall_ow.inc) */\n${OW_PROTO}`, 1],
  [OW_ROW, OW_ROW.replace('y - P->y', 'y + g_owBandDy - P->y'), 1],
  [OW_LATCH, `${OW_LATCH}  if (g_owBandDy) hdmaEn = 0;   /* ChronoKi tall: HDMA's tables cover the 224 lines */\n`, 1],
  [OW_LOOP_BG, OW_LOOP_BG.replace('(int y = 0; y < CAMH; y++) {', OW_LOOP), 1],
  [OW_LOOP_OBJ, OW_LOOP_OBJ.replace('(int y = 0; y < CAMH; y++) {', OW_LOOP).replace('if (X0 > 0) worldObjLinePieces(', 'if (X0 > 0 || g_owBandDy) worldObjLinePieces('), 1],
  [OW_LOOP_CLOUD, OW_LOOP_CLOUD.replace('(int y = 0; y < CAMH; y++) {', OW_LOOP), 1],
  [OW_LOOP_FIX, OW_LOOP_FIX.replace('(int y = 0; y < CAMH; y++) {', OW_LOOP), 1],
  [OW_WIN1, '  if (!g_owBandDy) owWindow1Pass(w, fb, owSubFb, W, X0);\n}', 1],
  [OW_MOT, OW_BANDS + OW_MOT, 1],
  [OW_PRESENT, `        if (ckOwBands) { ckTallWipe(); ckBandEnd(owBri); }   /* ChronoKi tall */\n${OW_PRESENT}`, 1],
];

// world.c: the overworld's uncut OBJ pieces kept up to the band rows (they are what the band composes draw)
const WORLD_PATCHES = [
  ['wy >= -15 && wy <= 223 && g_owWideN', 'wy >= -15 - ck_tall_rows() && wy <= 223 + ck_tall_rows() && g_owWideN', 1],
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

// `state` is writeStatePatches' result: field.c's and world.c's patched copies are rewritten in place, and title_intro.c's
// copy (with ck_tall_title.inc) joins state.files, replacing src/title_intro.c in the game module. Returns the patch counts.
const writeTallField = (state, belthasar) => {
  const field = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!field) throw new Error('tall-field: no patched field.c from state-patches.mjs');
  const world = state.files.find((f) => /[\\/]world\.c$/.test(f));
  if (!world) throw new Error('tall-field: no patched world.c from state-patches.mjs');
  if (!belthasar) throw new Error('tall-field: the belthasar import directory is needed (title_intro.c)');
  writeFileSync(field, applyPatches('field.c', readFileSync(field, 'utf8'), TALL_PATCHES));
  writeFileSync(world, `#include "ck_reconnect.h"   /* ChronoKi tall: ck_tall_rows */\n${applyPatches('world.c', readFileSync(world, 'utf8'), WORLD_PATCHES)}`);
  const title = join(dirname(field), 'title_intro.c');
  if (!state.files.includes(title)) {
    const src = readFileSync(join(belthasar, 'src', 'title_intro.c'), 'utf8').replace(/\r\n/g, '\n');
    if (!src.includes('void CtTitleIntroRenderEx(')) throw new Error('tall-field: title_intro.c has no CtTitleIntroRenderEx; update patches/tall-field.mjs');
    writeFileSync(title, `${src}\n#include "ck_tall_title.inc"   /* ChronoKi tall (T4) */\n`);
    state.files.push(title);
    state.replaced.push('src/title_intro.c');
  }
  return { patches: TALL_PATCHES.length + WORLD_PATCHES.length, files: [field, world, title] };
};

export { TALL_PATCHES, WORLD_PATCHES, writeTallField };
