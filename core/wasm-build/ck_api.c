/* The exports port-kit's CHRONOKI_CORE definition calls (plus the frame size, which varies with the widescreen and
   render-scale options). All plain synchronous functions: see ck_loop.c for how a frame is paced. */
#include <emscripten.h>
#include "ck_reconnect.h"
#include "ck_music.h"

static int g_paused = 0;

EMSCRIPTEN_KEEPALIVE void CkStop(void) { ck_stop(); }
EMSCRIPTEN_KEEPALIVE void CkSetPaused(int paused) { g_paused = paused != 0; }
/* Dim Flashes (reconnect/ck_dim_flashes.inc): 1 limits large single-frame brightness jumps, 0 leaves frames as drawn. */
EMSCRIPTEN_KEEPALIVE void CkSetDimFlashes(int on) { ck_dim_flashes_set(on); }
/* Dialog pacing (reconnect/dialog_reconnect.c): Text Speed and Hold Speed in 1/4 units (4 = 1x, 0 = instant), Hold A to
   Accelerate, B Completes the Box. (4, 4, 0, 0) is the original one character a frame. */
EMSCRIPTEN_KEEPALIVE void CkSetDialogPacing(int baseQ4, int holdQ4, int hold, int fill, int autoSkip) { ck_dialog_pacing_set(baseQ4, holdQ4, hold, fill, autoSkip); }
EMSCRIPTEN_KEEPALIVE void CkRunFrame(void) {
  if (g_paused) return;
  ck_clock_advance_ms(1000.0 / 60.0);
  ck_credit(1);
}
EMSCRIPTEN_KEEPALIVE void CkSetInput(unsigned mask) { ck_set_input_snes(mask); }
/* The engine writes /saves/ct_sram.srm itself at an in-game save; the shell persists that file. */
EMSCRIPTEN_KEEPALIVE int CkSaveSram(void) { return 1; }
/* Save states (reconnect/ck_state.c). CkStateSave and CkStateLoad only raise a request; the engine services it at the next
   safe pass of its loop (held, and given up after a bounded number of frames). CkStateStatus: 0 idle, 1 pending, 2 ok,
   3 failed; CkStateReason says why. A saved container is read at CkStateBuffer for CkStateSize bytes, valid until the next
   save. A container to load is written at CkStateInput(len) first, then CkStateLoad(ptr, len) copies it. */
EMSCRIPTEN_KEEPALIVE int CkStateSave(void) { return ck_state_request_save(); }
EMSCRIPTEN_KEEPALIVE int CkStateLoad(const uint8_t* bytes, int len) { return ck_state_request_load(bytes, len); }
EMSCRIPTEN_KEEPALIVE const void* CkStateBuffer(void) { return ck_state_buffer((long*)0); }
EMSCRIPTEN_KEEPALIVE int CkStateSize(void) { long n = 0; ck_state_buffer(&n); return (int)n; }
EMSCRIPTEN_KEEPALIVE void* CkStateInput(int len) { return ck_state_input(len); }
EMSCRIPTEN_KEEPALIVE const char* CkStateStamp(void) { return ck_state_stamp(); }
EMSCRIPTEN_KEEPALIVE int CkStateStatus(void) { return ck_state_status(); }
EMSCRIPTEN_KEEPALIVE int CkStateReason(void) { return ck_state_reason(); }
EMSCRIPTEN_KEEPALIVE int CkStateAvailable(void) { return ck_state_available(); }
EMSCRIPTEN_KEEPALIVE const void* CkFramePtr(void) { return ck_frame_rgba(); }
EMSCRIPTEN_KEEPALIVE int CkFrameWidth(void) { int w, h; ck_frame_info(&w, &h); return w; }
EMSCRIPTEN_KEEPALIVE int CkFrameHeight(void) { int w, h; ck_frame_info(&w, &h); return h; }
/* the 1x picture the options ask for (the widescreen's width or 256, 224 + 2 x tall's band rows); the frame is k x that */
EMSCRIPTEN_KEEPALIVE int CkViewWidth(void) { int w, h; ck_view_size(&w, &h); return w; }
EMSCRIPTEN_KEEPALIVE int CkViewHeight(void) { int w, h; ck_view_size(&w, &h); return h; }
/* the shown frame's black extents (camera lock, reconnect/ck_camera_lock.inc): rows of the picture past the room above and below,
   columns past it left and right; CkViewScene is 1 for a field frame, 0 for any other scene */
EMSCRIPTEN_KEEPALIVE int CkViewBlackTop(void) { return ck_view_black(0); }
EMSCRIPTEN_KEEPALIVE int CkViewBlackBottom(void) { return ck_view_black(1); }
EMSCRIPTEN_KEEPALIVE int CkViewBlackLeft(void) { return ck_view_black(2); }
EMSCRIPTEN_KEEPALIVE int CkViewBlackRight(void) { return ck_view_black(3); }
EMSCRIPTEN_KEEPALIVE int CkViewScene(void) { return ck_view_scene(); }
EMSCRIPTEN_KEEPALIVE int CkViewOriginX(void) { return ck_view_origin(0); }
EMSCRIPTEN_KEEPALIVE int CkViewOriginY(void) { return ck_view_origin(1); }
/* The Edge Effect's environment picture (reconnect/edge_env_reconnect.c): CkSetEdgeEnv(1) while the host's effect draws,
   (0) when it stops. CkEnvValid is 1 when the frame shown last has one: RGBA at CkEnvPtr, CkEnvWidth x CkEnvHeight (the 1x
   picture, CkViewWidth x CkViewHeight); 0 = use the frame itself. */
EMSCRIPTEN_KEEPALIVE void CkSetEdgeEnv(int on) { ck_edge_env_set(on); }
EMSCRIPTEN_KEEPALIVE int CkEnvValid(void) { return ck_edge_env_valid(); }
EMSCRIPTEN_KEEPALIVE const void* CkEnvPtr(void) { return ck_edge_env_ptr(); }
EMSCRIPTEN_KEEPALIVE int CkEnvWidth(void) { int w, h; ck_edge_env_size(&w, &h); return w; }
EMSCRIPTEN_KEEPALIVE int CkEnvHeight(void) { int w, h; ck_edge_env_size(&w, &h); return h; }
EMSCRIPTEN_KEEPALIVE int CkFrameCount(void) { return (int)ck_frame_count(); }
/* Stereo frames queued since the last call (consumes them); CkSamplesPtr is the S16 interleaved buffer. */
EMSCRIPTEN_KEEPALIVE int CkSampleCount(void) { return ck_audio_take((const int16_t**)0); }
EMSCRIPTEN_KEEPALIVE const void* CkSamplesPtr(void) { return ck_audio_ptr(); }
/* The music tap (reconnect/music_tap.c). CkMusicState returns a CkMusicStateT snapshot (the commands seen since the last
   call plus D_SONG, D_SFX_VOICES and the music fade byte from ARAM) and empties the ring; read it after CkRunFrame.
   CkSetVoiceGains(music, sfx): 256 is unchanged, 0 silent, clamped to 0..256. Not in any save state. */
EMSCRIPTEN_KEEPALIVE const void* CkMusicState(void) { return ck_music_state(); }
EMSCRIPTEN_KEEPALIVE void CkSetVoiceGains(int music, int sfx) {
  g_ckGain[0] = music < 0 ? 0 : music > 256 ? 256 : music;
  g_ckGain[1] = sfx < 0 ? 0 : sfx > 256 ? 256 : sfx;
}
/* Multiworld (reconnect/ap_reconnect.c, ck_ap.h). Every hook is off until CkSetApOnline(1); death link also needs
   CkSetApDeathLink(1). CkApTakeEvents returns a CkApEventsT snapshot (chests opened, 0xCA gifts run, game overs with their
   cause) and empties the ring; read it after CkRunFrame. CkSetForeignName(kind, loc, key, text): kind 0 the default line,
   1 a chest (loc, record n), 2 a gift (loc, patchAt); "" removes. CkApKillParty arms a death-link kill (0 = refused, gate
   off); CkSetApKillLanding(0 next battle frame, 1 also a field game over at once). The received index (u16) and room hash
   (u32, 0 = no room) live in the save slot's spare SRAM tail and the save-state stamp. */
EMSCRIPTEN_KEEPALIVE void CkSetApOnline(int on) { ck_ap_set_online(on); }
EMSCRIPTEN_KEEPALIVE void CkSetApDeathLink(int on) { ck_ap_set_death_link(on); }
EMSCRIPTEN_KEEPALIVE int CkApForeignItemId(void) { return CK_AP_FOREIGN_ITEM; }
EMSCRIPTEN_KEEPALIVE void CkSetForeignName(int kind, int loc, int key, const char* text) { ck_ap_set_foreign_name(kind, loc, key, text); }
EMSCRIPTEN_KEEPALIVE void CkClearForeignNames(void) { ck_ap_clear_foreign_names(); }
EMSCRIPTEN_KEEPALIVE const void* CkApTakeEvents(void) { return ck_ap_take_events(); }
EMSCRIPTEN_KEEPALIVE int CkApKillParty(void) { return ck_ap_kill_party(); }
EMSCRIPTEN_KEEPALIVE void CkSetApKillLanding(int mode) { ck_ap_set_kill_landing(mode); }
EMSCRIPTEN_KEEPALIVE int CkGetApReceivedIndex(void) { return (int)ck_ap_received_index(); }
EMSCRIPTEN_KEEPALIVE void CkSetApReceivedIndex(int v) { ck_ap_set_received_index((unsigned)v); }
EMSCRIPTEN_KEEPALIVE unsigned CkGetApRoomHash(void) { return ck_ap_room_hash(); }
EMSCRIPTEN_KEEPALIVE void CkSetApRoomHash(unsigned v) { ck_ap_set_room_hash((uint32_t)v); }
