/* The WRLD section's World fields (docs/plans/save-state-anywhere-plan.md, phase 2): the overworld engine's dynamic state in
   field.c's `World wd`, by member, as CK_WORLD(top, path). `top` is the World member the path starts in (the build,
   core/wasm-build/world-fields.mjs, checks that every World member is either a `top` here or in its excluded list, and
   every CtWorldStream member except its two pointers is listed under stm); `path` is the designator written to the
   state, record name "wd.<path>". An X-macro list with no guard: whoever includes it defines CK_WORLD first.
   Not here, by class (the script has the list): pointers and views (wram is the host image the CORE section holds, vram is its
   own record), what worldInit derives from the asset pack (sprite atlases, the pristine object snapshots, the BG3 and colour
   math flags, the era, the 1999 A.D. extension) and the palette `pal`, which worldPalRefresh re-derives from `cgw`. */
CK_WORLD(cam, cam) CK_WORLD(mv, mv) CK_WORLD(camShow, camShow) CK_WORLD(posShowX, posShowX) CK_WORLD(posShowY, posShowY)
CK_WORLD(haveShow, haveShow) CK_WORLD(stm, stm.tilemap) CK_WORLD(stm, stm.e3) CK_WORLD(stm, stm.e7) CK_WORLD(stm, stm.staging)
CK_WORLD(stm, stm.stageOff) CK_WORLD(stm, stm.pend) CK_WORLD(stm, stm.nPend) CK_WORLD(cgw, cgw) CK_WORLD(entryLatch, entryLatch)
CK_WORLD(pfac, pfac) CK_WORLD(ppar, ppar) CK_WORLD(prevPhase, prevPhase) CK_WORLD(owLastDesc, owLastDesc)
CK_WORLD(owDescPrev, owDescPrev) CK_WORLD(owFlipF, owFlipF) CK_WORLD(owFlipD, owFlipD) CK_WORLD(owFlipN, owFlipN)
CK_WORLD(owComposeN, owComposeN) CK_WORLD(oamShow, oamShow) CK_WORLD(oamKeyShow, oamKeyShow) CK_WORLD(oamPosShow, oamPosShow)
CK_WORLD(wideShow, wideShow) CK_WORLD(wideShowN, wideShowN)
