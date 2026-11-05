// Build-time text patch for the field (src/field.c): dialog pacing, [chronoki] dialog_controls (reconnect/dialog_reconnect.c,
// lifted from RotP's dialog_pacing.c). Exact matches with an expected count; any mismatch stops the build (the camera-lock.mjs
// precedent). Applied on the field.c copy state-patches.mjs wrote under out/gen/state/. core/belthasar is never edited.
//  * The typewriter (C0/2126) is one block in main()'s loop: one iteration a frame while the box machine $0129 is 6. The
//    patch wraps that block, unchanged, in a loop of ck_dialog_steps(...) iterations. Off or neutral, ck_dialog_steps is 1:
//    the loop runs the block once with ckStep 0, which skips everything the patch adds, so the frame is the original one.
//  * Between two iterations of one frame the patch does the field NMI's slot copy (C0/EB79: the line buffer into window line
//    $0131 while $0136 != 0, the host's tbSlotPos/tbSlotN only), so a line finished mid-frame keeps its last characters when
//    the next iteration steps to the next line. $0136 itself is left to the frame's real NMI, after the loop. The loop stops
//    when the machine leaves state 6 (the window's end, 21D8; a pause, 21A8) or the reveal passes the window.
//  * Hold A and B read the frame's controller word padSerial (fieldLockInputBits: the engine's own pad, the word the NMI's
//    pad latch fieldPadNmi is made from). Nothing is masked: in state 6 the ROM ignores the buttons (C0/2018).
//  * Every name the patch declares sits inside a block of its own in the loop body, never among main()'s pre-loop locals,
//    so CtHostState (host-fields.mjs) and every save state are unchanged.
import { readFileSync, writeFileSync } from 'node:fs';

const BLOCK_HEAD = '    if (tbActive && f.vm && tbStr && tbReveal <= tbLimit && mlBody) {\n'
  + '      uint8_t* tw = CtSceneMem7E(f.vm);\n'
  + "      if (tw && tw[0x0129] == 6 && !CtSceneTextboxResumeArmed(f.vm)) {   // (a pause's end, 2096, types from the next frame)\n";

const BLOCK_TAIL = '            tw[0x0136] = 1;                                              // 21A3\n'
  + '            tbReveal += 1;\n'
  + '          }\n'
  + '        }\n'
  + '      }\n'
  + '    }\n'
  + "    // C0/EB79, the field NMI's text upload:";

const PACING_HEAD = '    { const uint8_t* ckTw = (tbActive && f.vm && tbStr) ? CtSceneMem7E(f.vm) : NULL;   /* ChronoKi dialog pacing */\n'
  + '      const int ckPhase = !ckTw ? 0\n'
  + '        : (ckTw[0x0129] == 6 && mlBody && tbReveal <= tbLimit && !CtSceneTextboxResumeArmed(f.vm)) ? 1\n'
  + '        : (ckTw[0x0129] == 6 || (ckTw[0x0129] == 7 && !(ckTw[0x0134] == 0xFF && ckTw[0x0135] == 0xFF))) ? 2 : 0;\n'
  + '      const int ckSteps = ck_dialog_steps(ckPhase, (padSerial & PAD_A) != 0, (padSerial & PAD_B) != 0);\n'
  + '    for (int ckStep = 0; ckStep < ckSteps; ckStep++) {\n'
  + '    if (ckStep > 0) {   /* the NMI slot copy for the iteration before (C0/EB79), then stop once the box stops typing */\n'
  + '      uint8_t* ckNb = CtSceneMem7E(f.vm);\n'
  + '      if (ckNb[0x0136] && !CtFieldNmiTilemapArm(ckNb[0x0146])) { const int ckK = ckNb[0x0131] & 3; tbSlotPos[ckK] = tbBufPos; tbSlotN[ckK] = tbBufN; }\n'
  + '      if (ckNb[0x0129] != 6 || tbReveal > tbLimit) break;\n'
  + '    }\n';

const PACING_TAIL = BLOCK_TAIL.replace("    }\n    // C0/EB79", "    }\n    } }   /* ChronoKi dialog pacing: the iterations loop */\n    // C0/EB79");

// [what to find, what to put, how many times it must occur]
const DIALOG_PATCHES = [
  [BLOCK_HEAD, `${PACING_HEAD}${BLOCK_HEAD}`, 1],
  [BLOCK_TAIL, PACING_TAIL, 1],
];

// names the inserted code uses, which must already be in field.c where it lands (a rename upstream fails here, not in emcc)
const NEEDED = ['#define PAD_A 0x100\n', '#define PAD_B 0x001\n', 'const uint16_t padSerial = ', 'int tbSlotPos[4] = ',
  'tbSlotN[4] = ', 'CtFieldNmiTilemapArm(nb[0x0146])', '#include "ck_reconnect.h"\n'];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/dialog-pacing.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const checkNeeded = (name, text) => {
  for (const find of NEEDED) {
    if (occurrences(text, find) < 1) throw new Error(`${name}: ${JSON.stringify(find)} not found; update patches/dialog-pacing.mjs`);
  }
};

// `state` is writeStatePatches' result (already rewritten by the earlier field.c patches): field.c's copy is patched in place.
const writeDialogPacing = (state) => {
  const field = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!field) throw new Error('dialog-pacing: no patched field.c from state-patches.mjs');
  const text = readFileSync(field, 'utf8');
  checkNeeded('field.c', text);
  writeFileSync(field, applyPatches('field.c', text, DIALOG_PATCHES));
  return { patches: DIALOG_PATCHES.length, files: [field] };
};

export { DIALOG_PATCHES, writeDialogPacing };
