// Build-time text patch for the VM (src/ct_vm.c): "Disable glitches" (JoT flag g, key disableGlitches), the save-anywhere half.
// JoT clears bit 7 of $7F01CF (the save-point flag) on every field reboot; the ROM leaves it set after a save-point scene, so
// the menu's Save entry stays open on a field map. One exact match, count 1; any mismatch stops the build (the era-gauge.mjs
// precedent). Applied on the patched ct_vm.c copy state-patches.mjs wrote under out/gen/state/. core/belthasar is never edited.
//  * Gate: ck_randomizer() && ck_disable_glitches() (reconnect/settings_reconnect.c), the host's `[game] randomizer = 1` and
//    `disable_glitches = 1` in ct_settings.ini. Off (the default, and every vanilla game): nothing changes.
//  * Point: CtSceneExitCommit, the pending change's commit (C0/0C9A) that the fade-change ops (0xE0, 0xE2, positional exits)
//    pass through; the destination's own script runs after it and may set the flag again, as at a save point.
import { readFileSync, writeFileSync } from 'node:fs';

const ANCHOR = '  sc->locChange = 1;';
const PATCHED = `  if (ck_randomizer() && ck_disable_glitches()) w8(sc->mem, 0x7F01CF, r8(sc->mem, 0x7F01CF) & 0x7F);   /* ChronoKi: JoT clears the save-point flag at the location change */
${ANCHOR}`;

// [what to find, what to put, how many times it must occur]
const SAVE_FLAG_PATCHES = [[ANCHOR, PATCHED, 1]];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/save-flag-reset.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const writeSaveFlagReset = (state) => {
  const vm = state.files.find((f) => /[\\/]ct_vm\.c$/.test(f));
  if (!vm) throw new Error('save-flag-reset: no patched ct_vm.c from state-patches.mjs');
  writeFileSync(vm, applyPatches('ct_vm.c', readFileSync(vm, 'utf8'), SAVE_FLAG_PATCHES));
  return { patches: SAVE_FLAG_PATCHES.length, files: [vm] };
};

export { SAVE_FLAG_PATCHES, writeSaveFlagReset };
