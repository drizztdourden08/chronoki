/* Save states, host side. The engine's own scene save and load (ct_vm.c CtSceneSaveState / CtSceneLoadState, audio.c
   CtAudioSaveState / CtAudioLoadState) work on file paths; the build patches (wasm-build/state-patches.mjs) route the two
   paths "mem:scene" and "mem:apu" here (ck_fopen), so the bytes stay in linear memory and no file is made.

   The request is a flag. field.c's loop calls ck_state_top() once per pass with the mode it is in; the request is serviced
   on the first pass whose mode has a section (1 = a field scene, 2 = the open overworld), held while the mode has none, and
   given up after CK_HOLD_FRAMES with the reason "not now". A field save or load runs inside field.c's debug-key block, which
   asks ck_state_take_save / ck_state_take_load for its edge; the overworld save is taken right here.

   The container is CKST v2: "CKST", u32 version 2, u32 section count, then per section a 4 byte tag, u32 version, u32 length
   and the bytes. Sections: STMP (the stamp, "key=value" lines), CORE (the 128 KB WRAM then the 8 KB SRAM), SCEN (the scene
   state), APU (the sound machine state). */
#include "ck_reconnect.h"
#include "ck_state_stamp.h"
#include "audio.h"
#include "ct_vm.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CK_HOLD_FRAMES 120      /* a request held in a mode with no section gives up after this many passes */
#define CK_TAKEN_FRAMES 900     /* ...and a load that walks to another location, after this many */
#define CK_WRAM_BYTES 0x20000
#define CK_SRAM_BYTES 0x2000
#define CK_STAMP_VERSION 1
#define CK_SECTION_VERSION 1

enum { CK_IDLE, CK_WAIT_SAVE, CK_WAIT_LOAD, CK_SAVE_TAKEN, CK_LOAD_TAKEN };
enum { CK_MODE_NONE, CK_MODE_FIELD, CK_MODE_WORLD };
enum { CK_REASON_NONE, CK_REASON_NOT_A_STATE, CK_REASON_SCHEMA, CK_REASON_MODE, CK_REASON_NOT_NOW, CK_REASON_CORRUPT, CK_REASON_FAILED };

typedef struct { char* buf; size_t size; } OutChan;
typedef struct { const uint8_t* data; size_t len; } InChan;
typedef struct { const uint8_t* data; uint32_t len; } Span;

static OutChan g_out[2];                 /* 0 scene, 1 apu: what the engine just wrote */
static InChan g_in[2];                   /* what the engine reads back on a load */
static uint8_t* g_loadCopy = NULL;       /* the staged container the g_in spans point into */
static uint8_t* g_input = NULL;          /* CkStateInput's buffer */
static size_t g_inputCap = 0;
static uint8_t* g_result = NULL;         /* the last container saved */
static size_t g_resultLen = 0;
static uint8_t* g_core = NULL;           /* the core block taken at the save frame */

static int g_phase = CK_IDLE;
static int g_status = 0;                 /* 0 idle, 1 pending, 2 ok, 3 failed */
static int g_reason = CK_REASON_NONE;
static int g_mode = CK_MODE_NONE;
static int g_go = 0;                     /* this pass may take the request */
static int g_waited = 0;
static void* g_wram = NULL;
static const uint8_t* g_sram = NULL;
static void* g_audio = NULL;
static int g_takenMode = CK_MODE_NONE;

static int chanOf(const char* path) {
  if (!path) return -1;
  if (!strcmp(path, "mem:scene")) return 0;
  if (!strcmp(path, "mem:apu")) return 1;
  return -1;
}

FILE* ck_fopen(const char* path, const char* mode) {
  int ch = chanOf(path);
  if (ch < 0) return fopen(path, mode);
  if (mode[0] == 'w') {
    free(g_out[ch].buf);
    g_out[ch].buf = NULL; g_out[ch].size = 0;
    return open_memstream(&g_out[ch].buf, &g_out[ch].size);
  }
  if (!g_in[ch].data || !g_in[ch].len) return NULL;
  return fmemopen((void*)g_in[ch].data, g_in[ch].len, "r");
}

static void clearOut(void) {
  for (int i = 0; i < 2; i++) { free(g_out[i].buf); g_out[i].buf = NULL; g_out[i].size = 0; }
}

static void put32(uint8_t* p, uint32_t v) { p[0] = (uint8_t)v; p[1] = (uint8_t)(v >> 8); p[2] = (uint8_t)(v >> 16); p[3] = (uint8_t)(v >> 24); }
static uint32_t get32(const uint8_t* p) { return (uint32_t)p[0] | ((uint32_t)p[1] << 8) | ((uint32_t)p[2] << 16) | ((uint32_t)p[3] << 24); }

static const char* modeTag(int mode) { return mode == CK_MODE_WORLD ? "world" : "field"; }

const char* ck_state_stamp(void) {
  static char text[256];
  snprintf(text, sizeof text, "pin=%s\ncore=%s\nschema=%s\nmode=%s\n", CK_STATE_PIN_COMMIT, CK_STATE_CORE_VERSION, CK_STATE_SCHEMA, modeTag(g_mode));
  return text;
}

static size_t putSection(uint8_t* p, const char* tag, const uint8_t* data, size_t len) {
  memcpy(p, tag, 4);
  put32(p + 4, CK_SECTION_VERSION);
  put32(p + 8, (uint32_t)len);
  if (len) memcpy(p + 12, data, len);
  return 12 + len;
}

static int assemble(int mode, const uint8_t* scene, size_t sceneLen, const uint8_t* apu, size_t apuLen) {
  char stamp[320];
  int stampLen = snprintf(stamp, sizeof stamp, "pin=%s\ncore=%s\nschema=%s\nmode=%s\n",
                          CK_STATE_PIN_COMMIT, CK_STATE_CORE_VERSION, CK_STATE_SCHEMA, modeTag(mode));
  size_t coreLen = CK_WRAM_BYTES + CK_SRAM_BYTES;
  int count = 3 + (scene ? 1 : 0);
  size_t total = 12 + (size_t)count * 12 + (size_t)stampLen + coreLen + sceneLen + apuLen;
  uint8_t* out = (uint8_t*)malloc(total);
  if (!out || !g_core) { free(out); return 0; }
  memcpy(out, "CKST", 4);
  put32(out + 4, 2);
  put32(out + 8, (uint32_t)count);
  size_t at = 12;
  at += putSection(out + at, "STMP", (const uint8_t*)stamp, (size_t)stampLen);
  at += putSection(out + at, "CORE", g_core, coreLen);
  if (scene) at += putSection(out + at, "SCEN", scene, sceneLen);
  at += putSection(out + at, "APU ", apu, apuLen);
  free(g_result);
  g_result = out; g_resultLen = at;
  return 1;
}

static void takeCore(void) {
  if (!g_core) g_core = (uint8_t*)malloc(CK_WRAM_BYTES + CK_SRAM_BYTES);
  if (!g_core || !g_wram) return;
  memcpy(g_core, CtWramSys((CtWram*)g_wram), CK_WRAM_BYTES);
  if (g_sram) memcpy(g_core + CK_WRAM_BYTES, g_sram, CK_SRAM_BYTES);
  else memset(g_core + CK_WRAM_BYTES, 0, CK_SRAM_BYTES);
}

static void finish(int ok, int reason) {
  g_phase = CK_IDLE;
  g_status = ok ? 2 : 3;
  g_reason = ok ? CK_REASON_NONE : reason;
  g_waited = 0;
}

static void finishSave(void) {
  int ok = g_out[0].buf && g_out[0].size > 0
        && assemble(g_takenMode, (const uint8_t*)g_out[0].buf, g_out[0].size, (const uint8_t*)g_out[1].buf, g_out[1].size);
  clearOut();
  finish(ok, CK_REASON_FAILED);
}

static void saveWorld(void) {
  takeCore();
  clearOut();
  if (g_audio) CtAudioSaveState((CtAudio*)g_audio, "mem:apu");
  int ok = assemble(CK_MODE_WORLD, NULL, 0, (const uint8_t*)g_out[1].buf, g_out[1].size);
  clearOut();
  finish(ok, CK_REASON_FAILED);
}

void ck_state_top(int mode, void* wram, const uint8_t* sram, void* audio) {
  g_mode = mode; g_wram = wram; g_sram = sram; g_audio = audio; g_go = 0;
  if (g_phase == CK_SAVE_TAKEN) { finishSave(); return; }
  if (g_phase == CK_LOAD_TAKEN) {
    if (++g_waited > CK_TAKEN_FRAMES) finish(0, CK_REASON_NOT_NOW);
    return;
  }
  if (g_phase == CK_IDLE) return;
  if (++g_waited > CK_HOLD_FRAMES) { finish(0, CK_REASON_NOT_NOW); return; }
  if (mode == CK_MODE_NONE) return;
  if (g_phase == CK_WAIT_SAVE && mode == CK_MODE_WORLD) { saveWorld(); return; }
  g_go = 1;
}

int ck_state_take_save(void) {
  if (!g_go || g_phase != CK_WAIT_SAVE || g_mode != CK_MODE_FIELD) return 0;
  g_go = 0;
  takeCore();
  clearOut();
  g_takenMode = CK_MODE_FIELD;
  g_phase = CK_SAVE_TAKEN;
  return 1;
}

int ck_state_take_load(void) {
  if (!g_go || g_phase != CK_WAIT_LOAD) return 0;
  g_go = 0;
  g_phase = CK_LOAD_TAKEN;
  g_waited = 0;
  return 1;
}

void ck_state_load_result(int r) {
  if (g_phase != CK_LOAD_TAKEN) return;
  finish(r != 0, CK_REASON_FAILED);
}

int ck_state_request_save(void) {
  if (g_phase != CK_IDLE) return 0;
  g_phase = CK_WAIT_SAVE; g_status = 1; g_reason = CK_REASON_NONE; g_waited = 0;
  return 1;
}

static Span findSection(const uint8_t* p, size_t len, const char* tag) {
  Span none = { NULL, 0 };
  uint32_t count = len >= 12 ? get32(p + 8) : 0;
  size_t at = 12;
  for (uint32_t i = 0; i < count; i++) {
    if (at + 12 > len) return none;
    uint32_t n = get32(p + at + 8);
    if (n > len - at - 12) return none;
    if (!memcmp(p + at, tag, 4)) { Span s = { p + at + 12, n }; return s; }
    at += 12 + n;
  }
  return none;
}

static int stampHas(Span stamp, const char* line) {
  size_t n = strlen(line);
  for (size_t i = 0; i + n <= stamp.len; i++)
    if (!memcmp(stamp.data + i, line, n) && (i == 0 || stamp.data[i - 1] == '\n') && (i + n == stamp.len || stamp.data[i + n] == '\n')) return 1;
  return 0;
}

static int refuse(int reason) { g_status = 3; g_reason = reason; return 0; }

int ck_state_request_load(const uint8_t* p, long len) {
  if (g_phase != CK_IDLE) return 0;
  if (!p || len < 12 || memcmp(p, "CKST", 4) || get32(p + 4) != 2) return refuse(CK_REASON_NOT_A_STATE);
  Span stamp = findSection(p, (size_t)len, "STMP");
  Span scene = findSection(p, (size_t)len, "SCEN");
  Span apu = findSection(p, (size_t)len, "APU ");
  if (!stamp.data) return refuse(CK_REASON_CORRUPT);
  char schema[96];
  snprintf(schema, sizeof schema, "schema=%s", CK_STATE_SCHEMA);
  if (!stampHas(stamp, "legacy=1") && !stampHas(stamp, schema)) return refuse(CK_REASON_SCHEMA);
  if (stampHas(stamp, "mode=world") || !scene.data) return refuse(CK_REASON_MODE);
  free(g_loadCopy);
  g_loadCopy = (uint8_t*)malloc((size_t)len);
  if (!g_loadCopy) return refuse(CK_REASON_FAILED);
  memcpy(g_loadCopy, p, (size_t)len);
  scene = findSection(g_loadCopy, (size_t)len, "SCEN");
  apu = findSection(g_loadCopy, (size_t)len, "APU ");
  g_in[0].data = scene.data; g_in[0].len = scene.len;
  g_in[1].data = apu.data; g_in[1].len = apu.len;
  g_phase = CK_WAIT_LOAD; g_status = 1; g_reason = CK_REASON_NONE; g_waited = 0;
  return 1;
}

uint8_t* ck_state_input(long len) {
  if ((size_t)len > g_inputCap) {
    free(g_input);
    g_input = (uint8_t*)malloc((size_t)len);
    g_inputCap = g_input ? (size_t)len : 0;
  }
  return g_input;
}

const uint8_t* ck_state_buffer(long* len) { if (len) *len = (long)g_resultLen; return g_result; }
int ck_state_status(void) { return g_status; }
int ck_state_reason(void) { return g_reason; }
int ck_state_available(void) { return g_mode != CK_MODE_NONE && g_phase == CK_IDLE; }
