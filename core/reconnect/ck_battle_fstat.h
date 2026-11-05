/* The field.c statics the BATL section keeps: file-scope state of the battle's host outside main()'s locals (visible at the
   safe point, which is inside main()). The build (core/wasm-build/battle-fields.mjs) checks each name is still declared at
   file scope in the patched field.c. An X-macro list with no guard: whoever includes it defines CK_BFSTAT(name) first.
   - g_battleSndFrames: the NMIs the boot's and the return's sound chain crossed (the exit tail's length);
   - g_battleObjSaved: C0/0918's copy of $0920..$1DFF at $7F:2000 is live (the compose reads the field's page there);
   - g_battleEndFeet / g_battleEndFeetOn: the feet the ack keeps for the picture after it;
   - prevPort: fieldPadNmi's previous controller word, which the battle reads as $4218 (joyAutoRead), a function-local static
     state-patches.mjs makes file-scope;
   - g_ckBattleMap: the field's map ($7E:3000..AFFF) as the fight's entry found it, a copy state-patches.mjs adds there (the
     battle overwrites those bytes; the load rebuilds the field's picture and collision under the fight from it);
   - the field VRAM image and its companions (as in the menu section): the return rebuilds the tilemaps from them. */
CK_BFSTAT(g_battleSndFrames) CK_BFSTAT(g_battleObjSaved) CK_BFSTAT(g_battleEndFeet) CK_BFSTAT(g_battleEndFeetOn)
CK_BFSTAT(prevPort) CK_BFSTAT(g_ckBattleMap)
CK_BFSTAT(g_fieldVram) CK_BFSTAT(g_fieldCgram) CK_BFSTAT(g_bg3Plane) CK_BFSTAT(g_fieldVramFillPending)
