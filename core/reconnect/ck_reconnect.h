/* ChronoKi reconnect layer: what its files share. */
#ifndef CK_RECONNECT_H
#define CK_RECONNECT_H
#include <stdint.h>
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
int  ck_state_request(int save);       /* sdl_events.c: queue a synthetic F5 (save) or F9 (load) edge; 0 if one is pending */
int  ck_state_status(void);            /* sdl_events.c: 0 idle, 1 pending, 2 ok, 3 failed */
int  ck_state_available(void);         /* sdl_events.c: a save would be taken now */
#ifdef __cplusplus
}
#endif
#endif
