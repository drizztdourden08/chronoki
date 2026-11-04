/* The overworld half of the load (included in ck_host_point.inc's CK_OP_LOAD branch, inside main(), when the staged state has
   a WRLD section). Same order as --loadwram's world capture entry (field.c, before the main loop):
   1. the records must match this build's tables exactly (checked first: a refusal leaves the running game untouched);
   2. the state's WRAM goes into the host image, the field scene (if any) is freed, worldInit loads the world named by
      $7E:0100 (location $1F0 + id) and worldEnterAt places the lead at the position in $0283/$0285 (g_owCaptureStart: no
      entry song, the sound machine is restored below), then the WRAM goes back over what the placement rebuilt;
   3. the WRLD records overwrite the live World, the statics and the VRAM, the palette is re-derived from CGRAM, the sound
      machine and its host side are restored, and the HOST section is written back over main()'s locals.
   World.pal, the sprite atlases, the pristine object snapshots and the 1999 A.D. extension come from worldInit. */
{
  int ckOk = 0;
  const uint8_t* ckCore = ck_state_load_core();
  {
    /* (wd.vram may be NULL or stale here: this pass reads names and sizes only) */
#include "ck_world_table.inc"
    ckOk = ckCore && ck_state_load_world_check(ckWt, ckWn) && ck_state_load_host(&ckHost, ckHostFields, CK_HOST_COUNT);
  }
  uint8_t* ckHw = CtWramSys(fieldWram());
  int ckWid = ckOk ? (((ckCore[0x0100] | (ckCore[0x0101] << 8)) & 0x1FF) - 0x1F0) : -1;
  if (ckOk && ckWid >= 0 && ckWid < 8) {
    int ckPx = ckCore[0x0283] | (ckCore[0x0284] << 8), ckPy = ckCore[0x0285] | (ckCore[0x0286] << 8);
    memcpy(ckHw, ckCore, CK_STATE_WRAM_BYTES);
    fieldFree(&f);
    haveWorld = worldInit(&assets, &wd, ckWid);
    if (haveWorld) {
      g_owCaptureStart = 1; worldEnterAt(&wd, ckPx, ckPy); g_owCaptureStart = 0;
      memcpy(ckHw, ckCore, CK_STATE_WRAM_BYTES);
      { long rl = 0; const uint8_t* rimg = CtBattleRom(&rl); if (rimg) CtWorldSetRom(rimg, rl); CtWorldSetIrisCircle(CtIrisCircleImage); }
      {
#include "ck_world_table.inc"
        ckR = ck_state_load_world(ckWt, ckWn);
      }
      if (ckR) {
        worldPalRefresh(&wd, 0, 256);
        if (g_fieldAudio) CtAudioLoadState(g_fieldAudio, "mem:apu");
#define CK_HOST(t, n, d) memcpy(&n, &ckHost.n, sizeof ckHost.n);
#include "ck_host_fields.h"
#undef CK_HOST
        g_owObjFromCapture = 0;
        ckR = 1;
      }
    }
  }
}
