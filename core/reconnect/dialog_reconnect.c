/* Dialog pacing (lifted from RotP's core/game-hooks/dialog_pacing.c). The field textbox's typewriter (C0/2126, run by
   field.c while the box machine $0129 is in state 6) types one character per frame. A speed multiplier is "run that
   iteration more than once a frame": the patched field.c (wasm-build/patches/dialog-pacing.mjs) asks ck_dialog_steps how
   many iterations this frame gets and loops the original block that many times.
   Three requests share the count. The base multiplier (Text Speed). A hold multiplier while A is held. And a one-shot
   "fill": a fresh B press while the box is typing latches instant until the box stops typing for a press or closes. A
   pause code (`03 n`) is the box machine's own countdown, not a typewriter iteration, so no speed shortens it.
   A fourth request, Auto-Skip: text types instantly, and a plain box that finished typing and waits for the confirm press is
   dismissed after CK_DIALOG_AUTOSKIP_HOLD frames (ck_dialog_autoskip_press, called from the patched field.c where the A press
   is decided; it is never asked for a choice, name entry or live cursor).
   Every value here is host-side state, never WRAM or a CtHostState field, so a save state carries none of it; the host
   pushes the settings again after every load (CkSetDialogPacing resets the credit and the latch).
   Off ([chronoki] dialog_controls absent or 0), or Original speed with neither extra: one iteration a frame, the original
   single-step path, and nothing here changes. */
#include <string.h>
#include "ck_reconnect.h"

/* Multipliers in 1/4 units: 4 = 1.0x, 6 = 1.5x, 16 = 4x. 0 = instant. */
#define CK_DIALOG_Q4_ONE 4
#define CK_DIALOG_Q4_MAX 64
/* Iterations a frame at "instant": a full window (four lines, its breaks and its end) is well under this; the loop stops
   earlier when the box leaves state 6. */
#define CK_DIALOG_INSTANT_STEPS 240
/* Frames a finished plain box is held before Auto-Skip presses A for it. */
#define CK_DIALOG_AUTOSKIP_HOLD 20

static int g_on = 0, g_baseQ4 = CK_DIALOG_Q4_ONE, g_holdQ4 = 8, g_hold = 0, g_fill = 0, g_auto = 0;
static int g_credit = 0, g_waited = 0, g_fillLatched = 0, g_prevB = 0;

static int clampQ4(int q4) { return q4 < 0 ? 0 : q4 > CK_DIALOG_Q4_MAX ? CK_DIALOG_Q4_MAX : q4; }

static void resetRun(void) { g_credit = 0; g_fillLatched = 0; g_waited = 0; }

void ck_dialog_defaults(void) {
  g_on = 0; g_baseQ4 = CK_DIALOG_Q4_ONE; g_holdQ4 = 8; g_hold = 0; g_fill = 0; g_auto = 0;
  resetRun();
}

/* [chronoki] dialog_controls, dialog_speed_q4, dialog_hold_q4, dialog_hold, dialog_fill, dialog_auto_skip (settings_reconnect.c's apply).
   Returns 1 when the key is one of these. */
int ck_dialog_ini(const char* key, int iv) {
  if (!strcmp(key, "dialog_controls")) g_on = iv != 0;
  else if (!strcmp(key, "dialog_speed_q4")) g_baseQ4 = clampQ4(iv);
  else if (!strcmp(key, "dialog_hold_q4")) g_holdQ4 = clampQ4(iv);
  else if (!strcmp(key, "dialog_hold")) g_hold = iv != 0;
  else if (!strcmp(key, "dialog_fill")) g_fill = iv != 0;
  else if (!strcmp(key, "dialog_auto_skip")) g_auto = iv != 0;
  else return 0;
  return 1;
}

/* CkSetDialogPacing (ck_api.c). The host sends Original with no extras (4, 4, 0, 0, 0) when the gate is off. */
void ck_dialog_pacing_set(int baseQ4, int holdQ4, int hold, int fill, int autoSkip) {
  g_on = 1;
  g_baseQ4 = clampQ4(baseQ4);
  g_holdQ4 = clampQ4(holdQ4);
  g_hold = hold != 0;
  g_fill = fill != 0;
  g_auto = autoSkip != 0;
  resetRun();
}

static int neutral(void) { return !g_on || (g_baseQ4 == CK_DIALOG_Q4_ONE && !g_hold && !g_fill && !g_auto); }

/* phase: 0 no box typing (the latch ends), 1 the typewriter runs this frame, 2 the box is typing but not this frame
   (a pause's countdown, the frame a pause ends). aHeld / bHeld: the frame's controller word (field.c's padSerial). */
int ck_dialog_steps(int phase, int aHeld, int bHeld) {
  const int bEdge = bHeld && !g_prevB;
  g_prevB = bHeld != 0;
  if (phase == 0) g_fillLatched = 0;
  if (neutral()) return 1;
  if (g_fill && bEdge && phase != 0) g_fillLatched = 1;   /* a press during a pause still fills the rest of the box */
  if (phase != 1) return 1;
  if (g_auto) return CK_DIALOG_INSTANT_STEPS;
  int q4 = g_baseQ4;
  if (g_hold && aHeld && q4 != 0 && g_holdQ4 > q4) q4 = g_holdQ4;
  if (g_fillLatched || q4 == 0) return CK_DIALOG_INSTANT_STEPS;
  g_credit += q4;
  const int steps = g_credit >> 2;
  g_credit &= 3;
  return steps;
}

/* waiting: 1 when field.c sees a plain box (not a choice, name entry or live cursor) at the end of its text, waiting for A.
   Returns 1 on the frame the host should treat as an A press. Off or neutral: always 0, no state touched. */
int ck_dialog_autoskip_press(int waiting) {
  if (!g_on || !g_auto || !waiting) { g_waited = 0; return 0; }
  if (++g_waited < CK_DIALOG_AUTOSKIP_HOLD) return 0;
  g_waited = 0;
  return 1;
}
