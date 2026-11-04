/* world.c's cross-frame statics that the WRLD section keeps (group (c) of the plan's section 2). ck_world_state.inc, appended to
   the patched world.c, takes the address of each; the build (core/wasm-build/world-statics.mjs) checks that every
   non-const static world.c declares is either here or in its excluded list, by name. An X-macro list with no guard:
   whoever includes it defines CK_WSTAT(name) first.
   The draw list's per-frame results (shown, desc, node), the OAM build's keys, positions and uncut pieces (what the next
   picture is drawn from), the ghosts' blocks and flight flags, the inline-JSL suspension (a pass cut by the JSL and the block
   it resumes on), the time gauge's error post and the NMI's HDMA pushes and channel table. */
CK_WSTAT(g_owShownDesc) CK_WSTAT(g_owShown) CK_WSTAT(g_owNodeBlk) CK_WSTAT(g_owOamKey) CK_WSTAT(g_owOamPos) CK_WSTAT(g_owWide)
CK_WSTAT(g_owWideN) CK_WSTAT(g_owWideBlk) CK_WSTAT(g_owWideFlies) CK_WSTAT(g_owSuspendNmis) CK_WSTAT(g_owResumeBlock)
CK_WSTAT(g_owGaugeSound) CK_WSTAT(g_owNmiEn) CK_WSTAT(g_owNmiWh0) CK_WSTAT(g_owNmiWh1) CK_WSTAT(g_owHdma)
