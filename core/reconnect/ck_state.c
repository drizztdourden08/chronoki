/* Save states, host side. The engine's own scene save and load (ct_vm.c CtSceneSaveState / CtSceneLoadState, audio.c
   CtAudioSaveState / CtAudioLoadState) work on file paths; the build patches (wasm-build/state-patches.mjs) route the
   paths "mem:scene", "mem:apu" and "mem:apuh" here (ck_fopen), so the bytes stay in linear memory and no file is made.

   The request is a flag. field.c's loop runs ck_host_point.inc at the top of every pass, which asks ck_state_top with the
   mode the loop is in; the request is serviced on the first pass whose mode has a section (1 = a field scene, 2 = the open
   overworld), held while the mode has none, and given up after CK_HOLD_FRAMES with the reason "not now". The safe point
   does the work in the same pass and reports back with ck_state_save_done / ck_state_load_result.

   The container is CKST v2 (ck_state_box.c). Sections: STMP (the stamp, "key=value" lines), CORE (the 128 KB WRAM then the
   8 KB SRAM), SCEN (the scene state, field saves only), HOST (the host mode machine, ck_state_host.c), APU (the sound
   machine state), APUH (the sound's host side: its FIFO, cycle carry and field parity, ck_audio_state.inc; a state without
   it loads with the engine's reset of those). An overworld save (mode 2) has no SCEN and carries WRLD instead (phase 2:
   World's dynamic fields, world.c's and field.c's cross-frame statics and the 64 KB VRAM, as name/size records over live
   objects, ck_state_host.c); the loader enters the world from the CORE image, then overlays WRLD (ck_world_point.inc). */
#include "ck_state_internal.h"
#include "ck_state_stamp.h"
#include "ct_vm.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CK_HOLD_FRAMES 120      /* a request held in a mode with no section gives up after this many passes */
#define CK_SRAM_BYTES 0x2000
#define CK_CORE_BYTES (CK_STATE_WRAM_BYTES + CK_SRAM_BYTES)

enum { CK_IDLE, CK_WAIT_SAVE, CK_WAIT_LOAD, CK_SAVE_TAKEN, CK_LOAD_TAKEN };
enum { CK_MODE_NONE, CK_MODE_FIELD, CK_MODE_WORLD };
enum { CK_REASON_NONE, CK_REASON_NOT_A_STATE, CK_REASON_SCHEMA, CK_REASON_MODE, CK_REASON_NOT_NOW, CK_REASON_CORRUPT, CK_REASON_FAILED };

typedef struct { char* buf; size_t size; } OutChan;

#define CK_CHANNELS 3
static const char* const g_chanPath[CK_CHANNELS] = { "mem:scene", "mem:apu", "mem:apuh" };
static OutChan g_out[CK_CHANNELS];       /* 0 scene, 1 apu, 2 the sound's host side: what the engine just wrote */
static CkSpan g_in[CK_CHANNELS];         /* what the engine reads back on a load */
static CkSpan g_inCore, g_inHost, g_inWorld;   /* the staged state's CORE, HOST and WRLD sections */
static uint8_t* g_worldBytes = NULL;     /* the WRLD section staged by ck_state_save_world, until save_done */
static size_t g_worldLen = 0;
static uint8_t* g_loadCopy = NULL;       /* the staged container the spans point into */
static uint8_t* g_input = NULL;          /* CkStateInput's buffer */
static size_t g_inputCap = 0;
static uint8_t* g_result = NULL;         /* the last container saved */
static size_t g_resultLen = 0;
static uint8_t* g_core = NULL;           /* the core block taken at the save pass */

static int g_phase = CK_IDLE;
static int g_status = 0;                 /* 0 idle, 1 pending, 2 ok, 3 failed */
static int g_reason = CK_REASON_NONE;
static int g_mode = CK_MODE_NONE;
static int g_waited = 0;
static int g_takenMode = CK_MODE_NONE;

FILE* ck_fopen(const char* path, const char* mode) {
  int ch = -1;
  for (int i = 0; path && i < CK_CHANNELS && ch < 0; i++) if (!strcmp(path, g_chanPath[i])) ch = i;
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
  for (int i = 0; i < CK_CHANNELS; i++) { free(g_out[i].buf); g_out[i].buf = NULL; g_out[i].size = 0; }
  free(g_worldBytes); g_worldBytes = NULL; g_worldLen = 0;
}

void ck_state_save_world(const CkPtrField* table, int count) {
  free(g_worldBytes);
  g_worldLen = ck_fields_encode(NULL, table, count);
  g_worldBytes = (uint8_t*)malloc(g_worldLen ? g_worldLen : 1);
  if (g_worldBytes) ck_fields_encode(g_worldBytes, table, count); else g_worldLen = 0;
}

static const char* modeTag(int mode) { return mode == CK_MODE_WORLD ? "world" : "field"; }

static int stampText(char* out, size_t cap, int mode) {
  return snprintf(out, cap, "pin=%s\ncore=%s\nschema=%s\nmode=%s\n", CK_STATE_PIN_COMMIT, CK_STATE_CORE_VERSION, CK_STATE_SCHEMA, modeTag(mode));
}

const char* ck_state_stamp(void) {
  static char text[256];
  stampText(text, sizeof text, g_mode);
  return text;
}

static void finish(int ok, int reason) {
  g_phase = CK_IDLE;
  g_status = ok ? 2 : 3;
  g_reason = ok ? CK_REASON_NONE : reason;
  g_waited = 0;
}

static void takeCore(void* wram, const uint8_t* sram) {
  if (!g_core) g_core = (uint8_t*)malloc(CK_CORE_BYTES);
  if (!g_core) return;
  memcpy(g_core, CtWramSys((CtWram*)wram), CK_STATE_WRAM_BYTES);
  if (sram) memcpy(g_core + CK_STATE_WRAM_BYTES, sram, CK_SRAM_BYTES);
  else memset(g_core + CK_STATE_WRAM_BYTES, 0, CK_SRAM_BYTES);
}

int ck_state_top(int mode, void* wram, const uint8_t* sram) {
  g_mode = mode;
  if (g_phase == CK_SAVE_TAKEN || g_phase == CK_LOAD_TAKEN) { clearOut(); finish(0, CK_REASON_FAILED); return CK_OP_NONE; }
  if (g_phase == CK_IDLE) return CK_OP_NONE;
  if (++g_waited > CK_HOLD_FRAMES) { finish(0, CK_REASON_NOT_NOW); return CK_OP_NONE; }
  if (mode == CK_MODE_NONE || !wram) return CK_OP_NONE;
  if (g_phase == CK_WAIT_SAVE) {
    takeCore(wram, sram);
    clearOut();
    g_takenMode = mode;
    g_phase = CK_SAVE_TAKEN;
    return CK_OP_SAVE;
  }
  g_phase = CK_LOAD_TAKEN;
  return CK_OP_LOAD;
}

void ck_state_save_done(int ok, int withScene, const void* host, const CkHostField* table, int count) {
  if (g_phase != CK_SAVE_TAKEN) return;
  char stamp[320];
  int stampLen = stampText(stamp, sizeof stamp, g_takenMode);
  size_t hostLen = ck_host_encode(NULL, host, table, count);
  uint8_t* hostBytes = (uint8_t*)malloc(hostLen ? hostLen : 1);
  int scene = withScene && g_out[0].buf && g_out[0].size > 0;
  uint8_t* box = NULL;
  size_t boxLen = 0;
  if (ok && g_core && hostBytes && (scene || !withScene) && (g_takenMode != CK_MODE_WORLD || g_worldBytes)) {
    ck_host_encode(hostBytes, host, table, count);
    CkSection s[8];
    int n = 0;
    s[n++] = (CkSection){ "STMP", (const uint8_t*)stamp, (size_t)stampLen };
    s[n++] = (CkSection){ "CORE", g_core, CK_CORE_BYTES };
    if (scene) s[n++] = (CkSection){ "SCEN", (const uint8_t*)g_out[0].buf, g_out[0].size };
    s[n++] = (CkSection){ "HOST", hostBytes, hostLen };
    if (g_takenMode == CK_MODE_WORLD) s[n++] = (CkSection){ "WRLD", g_worldBytes, g_worldLen };
    s[n++] = (CkSection){ "APU ", (const uint8_t*)g_out[1].buf, g_out[1].size };
    if (g_out[2].buf && g_out[2].size > 0) s[n++] = (CkSection){ "APUH", (const uint8_t*)g_out[2].buf, g_out[2].size };
    box = ck_box_build(s, n, &boxLen);
  }
  free(hostBytes);
  clearOut();
  if (box) { free(g_result); g_result = box; g_resultLen = boxLen; }
  finish(box != NULL, CK_REASON_FAILED);
}

const uint8_t* ck_state_load_core(void) {
  return g_inCore.len >= CK_STATE_WRAM_BYTES ? g_inCore.data : NULL;
}

int ck_state_load_host(void* host, const CkHostField* table, int count) {
  return g_inHost.data && ck_host_decode(host, table, count, g_inHost);
}

int ck_state_load_has_world(void) { return g_inWorld.data != NULL; }
int ck_state_load_world_check(const CkPtrField* table, int count) { return g_inWorld.data && ck_fields_check(table, count, g_inWorld); }
int ck_state_load_world(const CkPtrField* table, int count) { return g_inWorld.data && ck_fields_decode(table, count, g_inWorld); }

void ck_state_load_result(int r) {
  if (g_phase != CK_LOAD_TAKEN) return;
  finish(r != 0, CK_REASON_FAILED);
}

int ck_state_request_save(void) {
  if (g_phase != CK_IDLE) return 0;
  g_phase = CK_WAIT_SAVE; g_status = 1; g_reason = CK_REASON_NONE; g_waited = 0;
  return 1;
}

static int refuse(int reason) { g_status = 3; g_reason = reason; return 0; }

int ck_state_request_load(const uint8_t* p, long len) {
  if (g_phase != CK_IDLE) return 0;
  if (!p || len < 12 || memcmp(p, "CKST", 4) || ck_get32(p + 4) != 2) return refuse(CK_REASON_NOT_A_STATE);
  CkSpan stamp = ck_box_find(p, (size_t)len, "STMP");
  if (!stamp.data) return refuse(CK_REASON_CORRUPT);
  char schema[96];
  snprintf(schema, sizeof schema, "schema=%s", CK_STATE_SCHEMA);
  if (!ck_box_has_line(stamp, "legacy=1") && !ck_box_has_line(stamp, schema)) return refuse(CK_REASON_SCHEMA);
  if (ck_box_has_line(stamp, "mode=world") ? !ck_box_find(p, (size_t)len, "WRLD").data : !ck_box_find(p, (size_t)len, "SCEN").data) return refuse(CK_REASON_MODE);
  free(g_loadCopy);
  g_loadCopy = (uint8_t*)malloc((size_t)len);
  if (!g_loadCopy) return refuse(CK_REASON_FAILED);
  memcpy(g_loadCopy, p, (size_t)len);
  g_in[0] = ck_box_find(g_loadCopy, (size_t)len, "SCEN");
  g_in[1] = ck_box_find(g_loadCopy, (size_t)len, "APU ");
  g_in[2] = ck_box_find(g_loadCopy, (size_t)len, "APUH");
  g_inCore = ck_box_find(g_loadCopy, (size_t)len, "CORE");
  g_inHost = ck_box_find(g_loadCopy, (size_t)len, "HOST");
  g_inWorld = ck_box_find(g_loadCopy, (size_t)len, "WRLD");
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
