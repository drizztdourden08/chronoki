/* src/xlat/*.c (the ROM's translated programs, ct.exe's lockstep references) is not in the data-free import. main.c names
   them in --xlatcmp / --hdmabuildxlat / --hdmafuzz only; these stand in so ct links, and report "no instruction there". */
#include <stdint.h>
#include "seq_xlat.h"

int CtXlat_seq_c3(CtXlat* x) { (void)x; return CT_XLAT_MISS; }
int CtXlat_wipe_c3(CtXlat* x) { (void)x; return CT_XLAT_MISS; }
int CtXlat_hdma_fd(CtXlat* x) { (void)x; return CT_XLAT_MISS; }
int CtXlat_owwin_c6(CtXlat* x) { (void)x; return CT_XLAT_MISS; }
int CtXlat_gwarp_fd(CtXlat* x) { (void)x; return CT_XLAT_MISS; }
int CtXlatHdmaBuild(const uint8_t* rom, long romLen, uint8_t* wram128) { (void)rom; (void)romLen; (void)wram128; return -1; }
