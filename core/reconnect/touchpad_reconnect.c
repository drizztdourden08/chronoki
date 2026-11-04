/* Input: the host's buttons arrive through CkSetInput(mask) as port-kit's SNES 12-bit mask and are handed to field.c
   as its touch pad's held buttons (a level; field.c makes the edges). Port-kit's order: B0 Y1 Select2 Start3 Up4 Down5
   Left6 Right7 A8 X9 L10 R11. The engine's (settings.h CT_BTN_*): UP0 DOWN1 LEFT2 RIGHT3 A4 B5 X6 Y7 L8 R9 SELECT10 START11. */
#include "touchpad.h"
#include "settings.h"
#include "ck_reconnect.h"

static uint32_t g_mask = 0;

void ck_set_input_snes(uint32_t s) {
  static const int8_t map[12] = {   /* snes bit -> CT_BTN */
    CT_BTN_B, CT_BTN_Y, CT_BTN_SELECT, CT_BTN_START, CT_BTN_UP, CT_BTN_DOWN, CT_BTN_LEFT, CT_BTN_RIGHT,
    CT_BTN_A, CT_BTN_X, CT_BTN_L, CT_BTN_R };
  uint32_t m = 0;
  for (int i = 0; i < 12; i++) if (s & (1u << i)) m |= 1u << map[i];
  g_mask = m;
}
uint32_t ck_input_mask(void) { return g_mask; }

int      CtTouchPadEnabled(int padInUse) { (void)padInUse; return 1; }
void     CtTouchPadSetOutput(int w, int h) { (void)w; (void)h; }
uint32_t CtTouchPadEvent(const SDL_Event* e) { (void)e; return 0; }
uint32_t CtTouchPadButtons(void) { return g_mask; }
void     CtTouchPadReset(void) {}
void     CtTouchPadNewFrame(void) {}
void     CtTouchPadBuild(CtTouchDraw* d) { if (d) { d->n = 0; d->alpha = 0; d->outW = d->outH = 0; d->dpadDirs = 0; } }
