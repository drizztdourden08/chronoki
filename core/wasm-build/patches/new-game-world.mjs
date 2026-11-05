// Build-time text patch for the field (src/field.c): on New Game only world 0 is the 1000 AD intro pan.
// One exact match, count 1; any mismatch stops the build (the camera-lock.mjs precedent). Applied right after
// writeCameraLock, on the patched field.c copy state-patches.mjs wrote under out/gen/state/. core/belthasar is never edited.
//  * Gate: ck_randomizer() (the host's `[game] randomizer = 1`); a vanilla game never runs the added line.
//  * A start state that enters another world on New Game gets the arrival tile instead of the intro pan.
import { readFileSync, writeFileSync } from 'node:fs';

const ANCHOR = 'haveWorld = worldInit(&assets, &wd, destWorld);';
const PATCHED = `if (ck_randomizer() && newGame && !ngIntroDone && destWorld != 0) ngIntroDone = 1;   /* ChronoKi: randomizer start states only; only world 0 is the intro pan */ ${ANCHOR}`;

// [what to find, what to put, how many times it must occur]
const WORLD_PATCHES = [[ANCHOR, PATCHED, 1]];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/new-game-world.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// `state` is writeStatePatches' result, already rewritten by the earlier patches: field.c's copy is patched in place.
const writeNewGameWorld = (state) => {
  const field = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!field) throw new Error('new-game-world: no patched field.c from state-patches.mjs');
  writeFileSync(field, applyPatches('field.c', readFileSync(field, 'utf8'), WORLD_PATCHES));
  return { patches: WORLD_PATCHES.length, files: [field] };
};

export { WORLD_PATCHES, writeNewGameWorld };
