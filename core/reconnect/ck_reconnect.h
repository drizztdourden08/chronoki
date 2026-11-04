/* ChronoKi reconnect layer: what its files share. */
#ifndef CK_RECONNECT_H
#define CK_RECONNECT_H
#include <stdint.h>
#include <stdio.h>
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
/* ck_state.c: save states (see its header comment). field.c reaches ck_state_top, take_* and load_result through the build patches. */
void ck_state_top(int mode, void* wram, const uint8_t* sram, void* audio);   /* once per pass of field.c's main loop; mode 0 none, 1 field scene, 2 overworld */
int  ck_state_take_save(void);         /* the debug-key block's F5 edge, once per request */
int  ck_state_take_load(void);         /* ...and its F9 edge */
void ck_state_load_result(int r);      /* what CtSceneLoadState answered */
FILE* ck_fopen(const char* path, const char* mode);   /* fopen, except "mem:scene" and "mem:apu" (ct_vm.c and audio.c are built with fopen = ck_fopen) */
int  ck_state_request_save(void);      /* 0 if a request is open */
int  ck_state_request_load(const uint8_t* bytes, long len);   /* 0 if one is open or the container is refused (reason set) */
uint8_t* ck_state_input(long len);     /* a buffer of len bytes in linear memory for the container to load */
const uint8_t* ck_state_buffer(long* len);   /* the last container saved */
const char* ck_state_stamp(void);      /* what this build stamps: pin, core version, schema hash */
int  ck_state_status(void);            /* 0 idle, 1 pending, 2 ok, 3 failed */
int  ck_state_reason(void);            /* why it failed: 0 none, 1 not a state, 2 schema, 3 mode, 4 not now, 5 corrupt, 6 failed */
int  ck_state_available(void);         /* the engine is in a mode with a state section and no request is open */
#ifdef __cplusplus
}
#endif
#endif
