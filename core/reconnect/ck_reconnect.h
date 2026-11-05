/* ChronoKi reconnect layer: what its files share. */
#ifndef CK_RECONNECT_H
#define CK_RECONNECT_H
#include <stdint.h>
#include <stdio.h>
#include "ck_ap.h"   /* multiworld hooks (ap_reconnect.c), called by the ap-*.mjs patched engine files */
#ifdef __cplusplus
extern "C" {
#endif
void ck_clock_advance_ms(double ms);   /* sdl_clock.c: the virtual clock */
void ck_yield_to_host(void);           /* wasm-build/ck_loop.c: park the engine until the host asks for a frame */
uint32_t ck_input_mask(void);          /* touchpad_reconnect.c: the CT_BTN_* mask CkSetInput stored */
void ck_set_input_snes(uint32_t snes); /* touchpad_reconnect.c: store a SNES 12-bit mask, remapped */
int  ck_audio_take(const int16_t** pcm);      /* sdl_audio.c: stereo frames accumulated since the last take (resets) */
const int16_t* ck_audio_ptr(void);     /* sdl_audio.c: the buffer take() reads from (not reset by take) */
void ck_frame_info(int* w, int* h);    /* present_reconnect.c */
const uint8_t* ck_frame_rgba(void);
long ck_frame_count(void);
void ck_credit(int n);                 /* wasm-build/ck_loop.c: let the engine run n more frames */
void ck_stop(void);
int  ck_wide_width(void);              /* settings_reconnect.c: [video] wide_width, 0 when unset (field.c's hostWideW returns it) */
/* settings_reconnect.c: [video] tall_lines, the field picture's even line count; CK_TALL_LINES_OFF (224) when unset or out of
   range. 480 = 224 + 2 x 128: RotP's top/bottom budget (kPpuExtraTopBottom, MIN_ASPECT 256/480). field.c's tall patch
   (wasm-build/patches/tall-field.mjs) reads it through hostTallT. */
#define CK_TALL_LINES_OFF 224
#define CK_TALL_LINES_MAX 480
int  ck_tall_lines(void);
/* field.c's tall patch (ck_tall_host.inc): the band rows a side this run draws (0 = off: headless, or tall_lines off), and the
   1x picture size the core reports (W = the widescreen's width or 256, H = 224 + 2 x the band rows). The patched world.c
   reads ck_tall_rows to keep the overworld pieces above and below the view; ck_api.c hands ck_view_size to the host. */
int  ck_tall_rows(void);
void ck_view_size(int* w, int* h);
/* settings_reconnect.c: [video] camera_lock, 0 or 1, default 1: the tall picture's camera is kept inside the room (ck_camera_lock.inc),
   and the widescreen's camera is the Steam release's clamped one; 0 = the ROM's camera and the original widescreen centring.
   ck_view_black (which: 0 top, 1 bottom, 2 left, 3 right) and ck_view_scene (1 field, 0 other): the shown frame's black extents. */
int  ck_camera_lock(void);
/* settings_reconnect.c: [game] randomizer, 0 or 1, default 0: a randomizer game (the host writes it into ct_settings.ini). The era-gauge
   patch (wasm-build/patches/era-gauge.mjs) opens a gauge era only when its world word is in a WRAM slot; 0 = the original gauge. */
int  ck_randomizer(void);
/* settings_reconnect.c: [game] disable_glitches, 0 or 1, default 0: with randomizer, the save-flag-reset patch
   (wasm-build/patches/save-flag-reset.mjs) clears the save-point flag at a location change (JoT flag g). */
int  ck_disable_glitches(void);
/* settings_reconnect.c: [chronoki] sightscope and visible_techs, 0 or 1, default 0 (off = the original game). */
int  ck_sightscope(void);
int  ck_visible_techs(void);
/* settings_reconnect.c: [chronoki] dim_flashes, 0 or 1, default 0 (off = the original game); CkSetDimFlashes (ck_api.c)
   changes it live. present_reconnect.c's flash limiter runs only while it is 1. */
int  ck_dim_flashes(void);
void ck_dim_flashes_set(int on);
/* dialog_reconnect.c: dialog pacing, the field typewriter's iterations a frame (wasm-build/patches/dialog-pacing.mjs).
   [chronoki] dialog_controls (0/1, default 0 = the original game), dialog_speed_q4, dialog_hold_q4 (1/4 units, 4 = 1x,
   0 = instant), dialog_hold, dialog_fill, dialog_auto_skip (0/1); CkSetDialogPacing (ck_api.c) changes them live. ck_dialog_steps returns
   1 when off or neutral, so the patched field.c runs its one original iteration. None of it is in a save state. */
void ck_dialog_defaults(void);
int  ck_dialog_ini(const char* key, int iv);
void ck_dialog_pacing_set(int baseQ4, int holdQ4, int hold, int fill, int autoSkip);
int  ck_dialog_steps(int phase, int aHeld, int bHeld);
int  ck_dialog_autoskip_press(int waiting);   /* Auto-Skip: 1 = press A for the finished plain box */
/* settings_reconnect.c (ck_dup_chars.inc): [chronoki] duplicate_characters, 0 or 1, default 0 (off = the original game).
   Character rando may then put two copies of one character in the party: a party byte is a SLOT (story identity) and
   sheet byte +0x00 ($7E:2600 + slot * 0x50) is its KIND (looks, attack, techs). The patched engine files
   (wasm-build/patches/duplicate-chars*.mjs) read every kind through these, each as `ck_dup_chars() ? kind : original`. */
int  ck_dup_chars(void);
int  ckPcKind(const uint8_t* wram, int slot);       /* the slot's kind; the slot when off / not a character */
int  ckTechSeat(const uint8_t* s, int ch);          /* battle: the seat a tech participant of kind ch resolves to */
int  ckSlotOfSeat(const uint8_t* s, int seat);      /* battle: the slot in seat 0..2 ($AEFF, else $AF0A), 0xFF none */
int  ckKindMaskToSlots(const uint8_t* wram, int kindMask);   /* menu: an equip mask by kind -> by slot */
int  ckKindAbsent(const uint8_t* wram);                      /* menu: FF/F865's absent mask, by kind */
int  ckRosterSlotOfKind(const uint8_t* wram, int kind, int notSlot);   /* menu: a partner slot of that kind, 7 none */
int  ckSheetKind(const uint8_t* sheet, int slot);            /* load screen: a saved sheet's kind */
const char* ckKindDefaultName(const uint8_t* wram, int slot);   /* the kind's default name, NULL = keep the slot's */
void ckDupDefaultNames(const uint8_t* wram);                 /* new game: CtSetName each slot shown as another kind */
int  ck_view_black(int which);
int  ck_view_scene(void);
int  ck_view_origin(int axis);   /* 0 x, 1 y: the shown field frame's picture origin (SNES px) */
/* edge_env_reconnect.c: the Edge Effect's environment picture (the shown field frame without its sprites, captions or
   boxes; built by the patched field.c, wasm-build/patches/edge-env.mjs). On only while the host's Edge Effect draws
   (CkSetEdgeEnv); off = nothing built. begin hands out the RGBA buffer for a w x h picture (NULL: refused), publish marks it
   shown (0: no picture this frame). */
int  ck_edge_env_on(void);
void ck_edge_env_set(int on);
uint8_t* ck_edge_env_begin(int w, int h);
void ck_edge_env_publish(int valid);
const uint8_t* ck_edge_env_ptr(void);
void ck_edge_env_size(int* w, int* h);
int  ck_edge_env_valid(void);
/* ck_state.c: save states (see its header comment). field.c reaches the ck_state_top .. ck_state_load_result group through
   ck_host_point.inc, the safe point the build includes at the top of its main loop. */
#define CK_STATE_WRAM_BYTES 0x20000
enum { CK_OP_NONE = 0, CK_OP_SAVE = 1, CK_OP_LOAD = 2 };
typedef struct { const char* name; uint32_t offset; uint32_t size; } CkHostField;   /* one CtHostState field (ck_host_state.h) */
typedef struct { const char* name; void* ptr; uint32_t size; } CkPtrField;   /* one WRLD record: a live object by name and size */
int  ck_state_top(int mode, void* wram, const uint8_t* sram);   /* once per pass; mode 0 none, 1 field scene, 2 overworld, 3 menu over a field, 4 menu over the overworld, 5 a fight; returns a CK_OP_* */
void ck_state_save_done(int ok, int withScene, const void* host, const CkHostField* table, int count);   /* after a CK_OP_SAVE */
const uint8_t* ck_state_load_core(void);   /* the staged state's 128 KB WRAM image (CORE), NULL if it has none */
int  ck_state_load_host(void* host, const CkHostField* table, int count);   /* overlays the HOST section on host; 0 if there is none */
void ck_state_save_world(const CkPtrField* table, int count);   /* before ck_state_save_done on the overworld: stages the WRLD section */
int  ck_state_load_has_world(void);    /* the staged state is an overworld one (it has a WRLD section) */
int  ck_state_load_world_check(const CkPtrField* table, int count);   /* the WRLD section holds exactly these records (name and size) */
int  ck_state_load_world(const CkPtrField* table, int count);         /* writes the WRLD records into the live objects; 0 if malformed */
int  ckWorldStatics(CkPtrField* out, int max);   /* world.c's cross-frame statics (ck_world_state.inc is appended to the patched world.c) */
void ck_state_save_menu(const CkPtrField* table, int count, const uint8_t* fb, size_t npx);   /* before ck_state_save_done with a menu open: stages MENU (the records) and MPIC (fb, npx pixels, may be NULL) */
int  ck_state_load_has_menu(void);     /* the staged state was taken with a menu open (it has a MENU section) */
int  ck_state_load_menu_check(const CkPtrField* table, int count);   /* the MENU section holds exactly these records (name and size) */
int  ck_state_load_menu_get(const char* name, void* dst, uint32_t size);   /* one MENU record copied out by name, no live object touched */
int  ck_state_load_menu(const CkPtrField* table, int count, uint8_t* fb, size_t npx);   /* writes the MENU records, and unpacks MPIC into fb (npx pixels) when fb is given; 0 if malformed */
int  ckMenuStatics(CkPtrField* out, int max);   /* menu.c's cross-frame statics (ck_menu_state.inc is appended to the patched menu.c) */
void ckMenuAfterLoad(const uint8_t* wram);      /* after the MENU records are written: re-derives menu.c's pointers (the char-select view of the WRAM) */
void ck_state_save_battle(const CkPtrField* table, int count);   /* before ck_state_save_done in a fight: stages the BATL section */
int  ck_state_load_has_battle(void);   /* the staged state was taken in a fight (it has a BATL section) */
int  ck_state_load_battle_check(const CkPtrField* table, int count);   /* the BATL section holds exactly these records (name and size) */
int  ck_state_load_battle_get(const char* name, void* dst, uint32_t size);   /* one BATL record copied out by name, no live object touched */
int  ck_state_load_battle(const CkPtrField* table, int count);         /* writes the BATL records into the live objects; 0 if malformed */
int  ckBattleStatics(CkPtrField* out, int max);   /* battle.c's cross-frame statics (ck_battle_state.inc is appended to the patched battle.c) */
void ckBattleAfterLoad(void);                    /* after the BATL records are written: clears battle.c's per-frame line cuts */
void ck_state_load_result(int r);      /* after a CK_OP_LOAD: what CtSceneLoadState answered */
int  ck_state_save_pending(void);      /* a save request is waiting for a safe point */
int  ck_state_load_in_sequence(void);  /* the staged state was taken inside a sequence (its HOST says so) */
void ck_state_load_refuse_mode(void);  /* ends a taken load as refused, reason "mode", nothing touched */
FILE* ck_fopen(const char* path, const char* mode);   /* fopen, except "mem:scene" and "mem:apu" (ct_vm.c and audio.c are built with fopen = ck_fopen) */
int  ck_state_request_save(void);      /* 0 if a request is open */
int  ck_state_request_load(const uint8_t* bytes, long len);   /* 0 if one is open or the container is refused (reason set) */
uint8_t* ck_state_input(long len);     /* a buffer of len bytes in linear memory for the container to load */
const uint8_t* ck_state_buffer(long* len);   /* the last container saved */
const char* ck_state_stamp(void);      /* what this build stamps: pin, core version, schema, section ids, past layouts */
int  ck_state_status(void);            /* 0 idle, 1 pending, 2 ok, 3 failed */
int  ck_state_reason(void);            /* why it failed: 0 none, 1 not a state, 2 schema, 3 mode, 4 not now, 5 corrupt, 6 failed */
int  ck_state_available(void);         /* the engine is in a mode with a state section and no request is open */
#ifdef __cplusplus
}
#endif
#endif
