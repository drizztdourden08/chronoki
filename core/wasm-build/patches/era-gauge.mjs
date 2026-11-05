// Build-time text patch for the overworld (src/world.c): the Epoch's time gauge in randomizer games (JoT's gauge patch,
// ct-jot-epoch-start-logic.md R2.6). One exact match, count 1; any mismatch stops the build (the new-game-world.mjs
// precedent). Applied on the patched world.c copy state-patches.mjs wrote under out/gen/state/. core/belthasar is never edited.
//  * Gate: ck_randomizer() (reconnect/settings_reconnect.c), the host's `[game] randomizer = 1` in ct_settings.ini. Off (the
//    default, and every vanilla game): the original line runs, so vanilla is unchanged.
//  * On: the table-select storyline threshold is 0x10, not 0xCC, and an era is offered only when its world word is in one of the
//    7 WRAM slots 7E2881..7E288D (saved, save record 0); a closed era returns the current location, which obGaugeCtl already skips.
import { readFileSync, writeFileSync } from 'node:fs';

const ANCHOR = '  return owRomW((ram[0x1BA6] >= 0xCC ? 0x6CA5 : 0x6C97) + 2 * (unsigned)(i & 0xFF));';
const PATCHED = `  if (ck_randomizer()) {   /* ChronoKi: era open only when its world word sits in a gauge slot (7E2881..7E288D) */
    unsigned w = owRomW((ram[0x1BA6] >= 0x10 ? 0x6CA5 : 0x6C97) + 2 * (unsigned)(i & 0xFF));
    static const unsigned short slots[7] = { 0x2881, 0x2883, 0x2885, 0x2887, 0x2889, 0x288B, 0x288D };
    for (int s = 0; s < 7; s++) if (obW(ram + slots[s]) == w) return w;
    return obW(ram + 0x0100) & 0x01FF;
  }
${ANCHOR}`;

// [what to find, what to put, how many times it must occur]
const ERA_PATCHES = [[ANCHOR, PATCHED, 1]];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/era-gauge.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const writeEraGauge = (state) => {
  const world = state.files.find((f) => /[\\/]world\.c$/.test(f));
  if (!world) throw new Error('era-gauge: no patched world.c from state-patches.mjs');
  writeFileSync(world, applyPatches('world.c', readFileSync(world, 'utf8'), ERA_PATCHES));
  return { patches: ERA_PATCHES.length, files: [world] };
};

export { ERA_PATCHES, writeEraGauge };
