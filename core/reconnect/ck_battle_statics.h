/* battle.c's statics and globals the BATL section keeps (ck_battle_state.inc, appended to the patched battle.c, takes their
   addresses). The build (core/wasm-build/battle-statics.mjs) checks CK_BSTAT against battle.c's file-scope statics (every
   other one must be classified there) and that each CK_BGLOB is still a global. Classes: docs/plans/save-state-host-fields.md,
   "Battle section". An X-macro list with no guard: whoever includes it defines CK_BSTAT(name) and CK_BGLOB(name) first.
   - gDeathScanPend: deaths whose CF/FE20 stores wait for C1/881C (cross-frame);
   - gBattleNmiLine, gBattleNmiPad: the rule's frame NMI line and pad latch (set at the tick's head, read by the main thread);
   - g_btRevalid: the command's target revalidation (set and read within a command, kept so a later read never meets 0);
   - g_fxPalArmedPreNmi: a teardown record armed ahead of the NMI that publishes it (read by the next commit);
   - g_fxProgStops: the background programs' stop count (a counter the fight keeps);
   - gBattleFxFixCarry: COLDATA's components the last compose left for the next frame's top lines. */
CK_BSTAT(gDeathScanPend) CK_BSTAT(gBattleNmiLine) CK_BSTAT(gBattleNmiPad) CK_BSTAT(g_btRevalid) CK_BSTAT(g_fxPalArmedPreNmi)
CK_BSTAT(g_fxProgStops)
CK_BGLOB(gBattleFxFixCarry)
