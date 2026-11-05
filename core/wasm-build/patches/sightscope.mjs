// Build-time text patch for the battle (src/battle.c): [chronoki] sightscope (ck_sightscope()). Exact matches with an
// expected count; any mismatch stops the build (the camera-lock.mjs precedent). core/belthasar is never edited: the
// copy goes under out/gen/sightscope/ with ck_reconnect.h included first, and replaces src/battle.c in the game module
// only (the mixer-gains.mjs precedent; the oracle keeps the original).
//  * With the option off every inserted branch must be the original code. B4 fills SIGHTSCOPE_PATCHES; empty = identical.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkBattleStatics } from '../battle-statics.mjs';
import { root } from '../sources.mjs';

// [what to find, what to put, how many times it must occur]
const SIGHTSCOPE_PATCHES = [];
// the save-state battle section (phase 4, docs/plans/save-state-anywhere-plan.md): reconnect/ck_battle_state.inc hands out
// the addresses of the battle.c statics the section keeps; battle-statics.mjs checks them against the original text.
const BATTLE_STATE_SUFFIX = '\n#include "ck_battle_state.inc"\n';

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/sightscope.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// returns { patches, files: [absolute paths of the patched copies], replaced: ['src/battle.c'] }
const writeSightscope = (genDir, belthasar) => {
  const dir = join(genDir, 'sightscope');
  mkdirSync(dir, { recursive: true });
  const battle = join(dir, 'battle.c');
  const text = readFileSync(join(belthasar, 'src', 'battle.c'), 'utf8').replace(/\r\n/g, '\n');
  checkBattleStatics(text, root);
  writeFileSync(battle, `#include "ck_reconnect.h"\n${applyPatches('battle.c', text, SIGHTSCOPE_PATCHES)}${BATTLE_STATE_SUFFIX}`);
  return { patches: SIGHTSCOPE_PATCHES.length, files: [battle], replaced: ['src/battle.c'] };
};

export { SIGHTSCOPE_PATCHES, writeSightscope };
