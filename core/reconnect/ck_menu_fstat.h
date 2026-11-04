/* The field.c statics the MENU section keeps (file-scope state of the menu hosts outside main()'s locals; visible at the safe
   point, which is inside main()): the strings screen's counters (g_str*) and the config screen's phase and cursors (g_cfg*). The build
   (core/wasm-build/menu-fields.mjs) checks each name is still declared. An X-macro list with no guard: whoever includes it
   defines CK_MFSTAT(name) first.
   The field VRAM image and its companions (g_fieldVram, g_fieldCgram, g_bg3Plane, g_fieldVramFillPending): the menu close
   (field.c, the RTL: fieldMapHeaderStage, then fieldEntryTilemapFill) rebuilds the tilemaps from this image, which also holds the
   chips scripts uploaded by DMA (fieldVramSink, the tile-DMA records) after the location load; a fieldLoad rebuilds only the base
   tiles, so without them the picture after the close shows the wrong chips (stray tile strips, missing curtains). */
CK_MFSTAT(g_strN) CK_MFSTAT(g_strRun) CK_MFSTAT(g_strKind) CK_MFSTAT(g_strX) CK_MFSTAT(g_strPer) CK_MFSTAT(g_cfgPhase)
CK_MFSTAT(g_cfgNameN) CK_MFSTAT(g_cfgValN)
CK_MFSTAT(g_fieldVram) CK_MFSTAT(g_fieldCgram) CK_MFSTAT(g_bg3Plane) CK_MFSTAT(g_fieldVramFillPending)
