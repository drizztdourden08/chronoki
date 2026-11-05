// Build-time text patch for the field (src/field.c): the widescreen's side objects draw at their OBJ priority (I-131).
// Exact matches with an expected count; any mismatch stops the build (the camera-lock.mjs precedent). Applied on the
// patched field.c copy state-patches.mjs wrote under out/gen/state/. core/belthasar is never edited.
//  * The cause: the widescreen's own objects (the loop over objects the ROM has not latched, which stand only in the
//    extra columns) pass drawSprite booleans (`(pair & 0x30) == 0x30`, 0 or 1) where it takes each half's OBJ priority
//    0-3. A priority-3 half became priority 1, never in front, so the BG priority-1 foreground pass painted over it: the
//    sleeper on an inn's side bed loses his head (its priority-3 top half under the pillow) once he is past the ROM's
//    window, while the ROM's own list (the 256 view plus two tiles) draws him whole.
//  * The fix gives the side objects what the ROM list's draw gives an object: the stored pair's priorities ($0C00 top,
//    $0C01 bottom, `>> 4 & 3`) and the map as the stencil for a priority-0/1 unit (drawSprite's own rule).
//  * Gate: the loop only runs with the wide picture (`wideW > CAMW`, the widescreen option); 4:3 never reaches it.
import { readFileSync, writeFileSync } from 'node:fs';

const PRIO = '        int tf = (w7[0x0C00 + o * 2] & 0x30) == 0x30, bf = (w7[0x0C01 + o * 2] & 0x30) == 0x30;';
const PRIO_FIXED = '        int tf = (w7[0x0C00 + o * 2] >> 4) & 3, bf = (w7[0x0C01 + o * 2] >> 4) & 3;'
  + '   /* ChronoKi wide sprites: each half\'s OBJ priority 0-3, as the ROM list\'s draw reads it */';

const DRAW = '        drawSprite(&assets, fb, sidx, spal, sp, af, sx, sy, front, tf, bf, 0, 0, 0, 0, 0, NULL, 0, NULL, NULL, NULL);';
const DRAW_FIXED = '        CtStencilSrc ckSideSten = { f.base, f.W, camx, camy, cw, ch };   /* ChronoKi wide sprites: a priority-0/1 unit loses to the map */\n'
  + '        drawSprite(&assets, fb, sidx, spal, sp, af, sx, sy, front, tf, bf, 0, 0, 0, 0, 0, NULL, 0, NULL, NULL, &ckSideSten);';

// [what to find, what to put, how many times it must occur]
const SIDE_PATCHES = [
  [PRIO, PRIO_FIXED, 1],
  [DRAW, DRAW_FIXED, 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/wide-side-sprites.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// `state` is writeStatePatches' result, already rewritten by the earlier patches: field.c's copy is patched in place.
const writeWideSideSprites = (state) => {
  const field = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!field) throw new Error('wide-side-sprites: no patched field.c from state-patches.mjs');
  writeFileSync(field, applyPatches('field.c', readFileSync(field, 'utf8'), SIDE_PATCHES));
  return { patches: SIDE_PATCHES.length, files: [field] };
};

export { SIDE_PATCHES, writeWideSideSprites };
