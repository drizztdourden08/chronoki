// Build-time text patch for haptics (I-119): the battle's event source, the same job as RotP's core/game-hooks/haptic_events.c
// on CT's engine (reconnect/haptic_reconnect.c has the logic, reconnect/ck_haptic.h the contract).
//  * battle.c CtBattleTick, right after the frame's body: `if (h && h->mem && ck_haptic_on()) ck_haptic_battle_tick(h->mem, h->frames);`
//    A read-only diff of the party's curHP and the enemy alive list; it writes no engine byte.
//  * Gate: ck_haptic_on() (CkSetHaptics). Off, the call site is one test and the original code runs unchanged.
// The anchor must match exactly once; a mismatch stops the build. Applied in place on the patched battle.c under out/gen/
// (after ap-death-link.mjs, whose edit is above this line). core/belthasar is never edited.
import { basename } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const BATTLE_PATCHES = [
  ['  int r = battleTickBody(h, endRequest, input);\n  if (h && h->mem && h->iterHead) {',
    '  int r = battleTickBody(h, endRequest, input);\n'
      + '  if (h && h->mem && ck_haptic_on()) ck_haptic_battle_tick(h->mem, h->frames);   /* [chronoki] haptics: report what this frame did */\n'
      + '  if (h && h->mem && h->iterHead) {', 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/haptic-events.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const INCLUDE = '#include "ck_reconnect.h"\n';
const withInclude = (text) => (text.includes(INCLUDE) ? text : INCLUDE + text);

// `sight` is writeDuplicateCharsBattle's result (its battle.c is the game module's copy, patched in place).
const writeHapticEvents = (sight) => {
  const battle = sight.files.find((f) => basename(f) === 'battle.c');
  if (!battle) throw new Error('haptic-events: no patched battle.c from sightscope.mjs / duplicate-chars-battle.mjs');
  const text = readFileSync(battle, 'utf8').replace(/\r\n/g, '\n');
  writeFileSync(battle, applyPatches('battle.c', withInclude(text), BATTLE_PATCHES));
  return { patches: BATTLE_PATCHES.length, files: [battle] };
};

export { BATTLE_PATCHES as HAPTIC_BATTLE_PATCHES, writeHapticEvents };
