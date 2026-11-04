/* menu.c's cross-frame statics that the MENU section keeps. ck_menu_state.inc, appended to the patched menu.c, takes the address
of each; the build (core/wasm-build/menu-statics.mjs) checks that every non-const static menu.c declares is either here or in
its excluded list with a class, by name. An X-macro list with no guard: whoever includes it defines CK_MSTAT(name) first.
The char-select cursor, the panel scroll and the dim, the nav-hand gate, the Equip preview's bytes and the clip window, the Item
screen's shelter gate, the HP-max dim, the menu sprite blocks (the characters' animation state), the hand flip, the exchange
figure and wave, the Tech screen's hand cell and list flag and the Save screen's prompt, cursor and hover. */
CK_MSTAT(g_charSelChar) CK_MSTAT(mPanelScroll) CK_MSTAT(mDim) CK_MSTAT(mNavHandOk) CK_MSTAT(mEqPrevOn) CK_MSTAT(mEqPrevNew)
CK_MSTAT(mEqPrevOld) CK_MSTAT(mClipTop) CK_MSTAT(mClipBot) CK_MSTAT(g_mItemShelterGate) CK_MSTAT(mPanelHpMaxDim) CK_MSTAT(g_mspr)
CK_MSTAT(mHandFlip) CK_MSTAT(mExchFigOn) CK_MSTAT(mExchWaveNext) CK_MSTAT(g_techHandCell) CK_MSTAT(g_techListRan)
CK_MSTAT(mSavePromptOn) CK_MSTAT(svLastCursor) CK_MSTAT(mSaveHoverPanel)
