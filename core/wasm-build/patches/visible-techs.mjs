// Build-time text patch for the menu (src/menu.c): [chronoki] visible_techs (ck_visible_techs()). Exact matches with an
// expected count; any mismatch stops the build (the camera-lock.mjs precedent). Applied right after writeStatePatches, on
// the menu.c copy it wrote under out/gen/state/. core/belthasar is never edited.
//  * With the option off every inserted branch must be the original code. B5 fills VISIBLE_TECHS_PATCHES; empty = identical.
import { readFileSync, writeFileSync } from 'node:fs';

// [what to find, what to put, how many times it must occur]
const VISIBLE_TECHS_PATCHES = [];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/visible-techs.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// `state` is writeStatePatches' result: menu.c's copy is patched in place.
const writeVisibleTechs = (state) => {
  const menu = state.files.find((f) => /[\\/]menu\.c$/.test(f));
  if (!menu) throw new Error('visible-techs: no patched menu.c from state-patches.mjs');
  writeFileSync(menu, applyPatches('menu.c', readFileSync(menu, 'utf8'), VISIBLE_TECHS_PATCHES));
  return { patches: VISIBLE_TECHS_PATCHES.length, files: [menu] };
};

export { VISIBLE_TECHS_PATCHES, writeVisibleTechs };
