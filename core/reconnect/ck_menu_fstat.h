/* The field.c statics the MENU section keeps (file-scope state of the menu hosts outside main()'s locals; visible at the safe
   point, which is inside main()): the strings screen's counters (g_str*) and the config screen's phase and cursors (g_cfg*). The build
   (core/wasm-build/menu-fields.mjs) checks each name is still declared. An X-macro list with no guard: whoever includes it
   defines CK_MFSTAT(name) first. */
CK_MFSTAT(g_strN) CK_MFSTAT(g_strRun) CK_MFSTAT(g_strKind) CK_MFSTAT(g_strX) CK_MFSTAT(g_strPer) CK_MFSTAT(g_cfgPhase)
CK_MFSTAT(g_cfgNameN) CK_MFSTAT(g_cfgValN)
