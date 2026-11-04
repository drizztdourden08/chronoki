/* The field.c statics the WRLD section keeps: file-scope state of the overworld host that lives outside `World` (visible at
   the safe point, which is inside main()). The build (core/wasm-build/world-fields.mjs) checks each name is still declared.
   An X-macro list with no guard: whoever includes it defines CK_FSTAT(name) first.
   The widescreen ghosts (picture only: the objects the 256-column strip lets fly on), the shadows the NMI pushes (g_owZpShow),
   OBSEL, the marker switch, and the era placard's idle counter (owIdle, a function-local static that ck_world_state.h makes
   file-scope, state-patches.mjs). */
CK_FSTAT(g_owGhost) CK_FSTAT(g_owGhostFly) CK_FSTAT(g_owGhostFrame) CK_FSTAT(g_owGhostLive) CK_FSTAT(g_owZpShow) CK_FSTAT(g_owZpHave)
CK_FSTAT(g_owObsel) CK_FSTAT(g_owNoMarker) CK_FSTAT(owIdle)
