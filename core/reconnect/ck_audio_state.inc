/* The sound's host side in a save state. core/wasm-build/state-patches.mjs appends this file to the game module's copy of
   audio.c, where struct CtAudio is complete, and renames the engine's CtAudioSaveState / CtAudioLoadState to the two
   static functions called below.

   The engine's state ("mem:apu", the APU section) is the sound processor alone. Around it CtAudio keeps what decides
   which samples a frame plays: the FIFO of samples made but not played yet (the output's latency behind the SPC), the
   fractional SPC cycles carried across frames (cycleCarry: where the next slice stops) and the field parity of the next
   slice (evenFrame: an odd frame is short). The engine's load empties the FIFO and zeroes the carry, so a replay from a
   state cut its slices a fraction of a cycle off the original's: now and then an instruction lands on the other side of a
   frame's stop, a frame comes out one sample short, plays a held sample and the stream stays a sample behind for dozens
   of frames. This writes them to "mem:apuh" (the APUH section, ck_state.c) and puts them back after the engine's load;
   a state without the section keeps the engine's reset. */
#include <stdint.h>
#include <string.h>

#define CK_AUDH_MAGIC 0x48445541u   /* "AUDH" */
#define CK_AUDH_VERSION 1u

typedef struct {
  uint32_t magic, version;
  double cycleCarry;
  int32_t evenFrame, mutedFrame;
  uint32_t dspLag;                  /* samples the reference DSP emitted that audTake has not moved into the FIFO yet */
  uint32_t fifoLen;                 /* the FIFO's samples (stereo pairs) follow, oldest first */
  int64_t fifoDropped;
} CkAudioHost;
_Static_assert(sizeof(CkAudioHost) == 40, "CkAudioHost has padding");

static int ckAudioHostSave(const CtAudio* a) {
  CkAudioHost h;
  memset(&h, 0, sizeof h);
  h.magic = CK_AUDH_MAGIC; h.version = CK_AUDH_VERSION;
  h.cycleCarry = a->cycleCarry; h.evenFrame = a->evenFrame; h.mutedFrame = a->mutedFrame;
  h.dspLag = a->apu && a->apu->dsp ? (uint16_t)(a->apu->dsp->sampleOffset - a->dspRead) : 0;
  h.fifoLen = a->fifoLen; h.fifoDropped = a->fifoDropped;
  FILE* f = fopen("mem:apuh", "wb");
  if (!f) return 0;
  unsigned first = CT_AUD_FIFO - a->fifoHead;          /* the FIFO is a ring: up to its end, then from its start */
  if (first > a->fifoLen) first = a->fifoLen;
  unsigned rest = a->fifoLen - first;
  int ok = fwrite(&h, sizeof h, 1, f) == 1
           && (!first || fwrite(&a->fifo[a->fifoHead * 2], sizeof(int16_t) * 2, first, f) == first)
           && (!rest || fwrite(&a->fifo[0], sizeof(int16_t) * 2, rest, f) == rest);
  fclose(f);
  return ok;
}

static void ckAudioHostLoad(CtAudio* a) {
  FILE* f = fopen("mem:apuh", "rb");
  if (!f) return;
  CkAudioHost h;
  if (fread(&h, sizeof h, 1, f) == 1 && h.magic == CK_AUDH_MAGIC && h.version == CK_AUDH_VERSION && h.fifoLen <= CT_AUD_FIFO
      && (!h.fifoLen || fread(a->fifo, sizeof(int16_t) * 2, h.fifoLen, f) == h.fifoLen)) {
    a->fifoHead = 0; a->fifoLen = h.fifoLen; a->fifoDropped = (long)h.fifoDropped;
    a->cycleCarry = h.cycleCarry; a->evenFrame = h.evenFrame; a->mutedFrame = h.mutedFrame;
    if (a->apu && a->apu->dsp) a->dspRead = (uint16_t)(a->apu->dsp->sampleOffset - h.dspLag);
  }
  fclose(f);
}

int CtAudioSaveState(CtAudio* a, const char* path) {
  int ok = ckAudioSaveEngine(a, path);
  if (ok && !strcmp(path, "mem:apu")) ok = ckAudioHostSave(a);
  return ok;
}

int CtAudioLoadState(CtAudio* a, const char* path) {
  int ok = ckAudioLoadEngine(a, path);
  if (ok && !strcmp(path, "mem:apu")) ckAudioHostLoad(a);
  return ok;
}
