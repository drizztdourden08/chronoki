/* ChronoKi tall rendering: the overworld's band rows (docs/plans/tall-rendering-engine-patch.md, T2). Included by the
   patched field.c right before hostUploadPictureAt, after ck_tall_host.inc (wasm-build/patches/tall-field.mjs).
   The overworld's compositor (worldComposeAt) draws 224 lines from the NMI's latched scroll. Each band is a second, partial
   compose of the same world with that scroll moved by the band's offset (the top band: -T lines, the bottom: CAMH - E),
   from a picture-only tilemap around the moved camera (CtWorldTilemapView: the streamed 64x32 ring holds only the rows the
   SNES shows), on a copy of the World (the compose keeps pose counters on it), with no motion record, no native frames
   between and window 1 off. The OBJ layer comes from the frame's uncut pieces (wideShow, which the patched world.c keeps
   up to the band rows), read at their screen row moved by the offset (g_owBandDy). HDMA's per-line scroll and window 1
   are left out of the bands (the line tables cover the SNES's 224 lines only). The bands go to the store before the
   brightness; the ow present ends them (ckBandEnd) with the frame's brightness. */
static int ckTallOwBands(const World* wd, int W, int X0, int T) {
  if (!wd->wram || !ckBandBegin(W, T)) return 0;
  static World cp;
  static CtWorldStream bst;
  static uint8_t buf[OW_WMAX * CAMH * 3];
  const int E = CK_TALL_EDGE, rows = T + E;
  if (rows > CAMH || W > OW_WMAX) return 0;
  const uint8_t* eg[2] = { NULL, NULL };
  if (W > CAMW && CtSettingsGet()->sceneAdjust && wd->extOn) owExtGrids(wd, eg);
  CtMotFrame* const keepMot = g_mot; OwNat* const keepNat = g_owNatRec;
  g_mot = NULL; g_owNatRec = NULL;
  for (int side = 0; side < 2; side++) {
    const int dy = side ? CAMH - E : -T;
    cp = *wd;
    CtWorldCam* cams[2] = { &cp.cam, &cp.camShow };
    for (int c = 0; c < 2; c++) {
      CtWorldCam* k = cams[c];
      k->bg1v = (uint16_t)(((k->bg1v + dy) % 1024 + 1024) % 1024);
      k->bg2v = (uint16_t)(((k->bg2v + dy) % 1024 + 1024) % 1024);
      k->bg3v = (uint16_t)(k->bg3v + dy);
    }
    memset(&bst, 0, sizeof bst);
    bst.ext[0] = eg[0]; bst.ext[1] = eg[1];
    CtWorldTilemapView(&bst, wd->wram, cp.haveShow ? &cp.camShow : &cp.cam);
    g_owBandDy = dy; g_owY0 = 0; g_owY1 = rows;
    worldComposeAt(&cp, buf, W, X0, &bst);
    for (int r = 0; r < rows; r++) {
      uint8_t* o = ckBandRow(r + dy);
      if (o) memcpy(o, buf + (size_t)r * W * 3, (size_t)W * 3);
    }
  }
  g_owBandDy = 0; g_owY0 = 0; g_owY1 = CAMH;
  g_mot = keepMot; g_owNatRec = keepNat;
  return 1;
}
