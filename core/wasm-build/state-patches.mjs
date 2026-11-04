// Build-time text patches that give the game module memory-backed save states (reconnect/ck_state.c). The import under
// core/belthasar is never edited: the patched copies are written under out/gen/ and replace the originals in the game
// module only (the oracle keeps the unpatched ones). Every patch is an exact match with an expected count and fails the
// build loudly when upstream's text moves.
//  * ct_vm.c and audio.c: fopen is ck_fopen, which routes the two paths "mem:scene" and "mem:apu" to linear memory.
//  * field.c: a hook at the top of the main loop (ck_state_top: which mode the loop is in), the debug-key block's F5 / F9
//    edges come from the request flag instead of the keyboard, and its paths are the memory ones.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PREFIX = '#include <stdio.h>\n#include "ck_reconnect.h"\n#define fopen ck_fopen\n';

const MODE_FIELD = '!selftest && f.vm && !battlePhase && !menuPhase && !inWorld && !gameOver && !fade && !pendKind';
const MODE_WORLD = '!selftest && !f.vm && inWorld && !battlePhase && !menuPhase && !fade && !pendKind';
const TOP_HOOK = `ck_state_top(${MODE_FIELD} ? 1 : (${MODE_WORLD} ? 2 : 0), fieldWram(), fieldSram(), g_fieldAudio);`;

// [what to find, what to put, how many times it must occur]
const FIELD_PATCHES = [
  ['  while (running && !g_shotsExit) {\n', `  while (running && !g_shotsExit) {\n    ${TOP_HOOK}\n`, 1],
  ['int f5 = dks[SDL_SCANCODE_F5], f9 = dks[SDL_SCANCODE_F9];', 'int f5 = ck_state_take_save(), f9 = ck_state_take_load();', 1],
  ['int ok = CtSceneSaveState(f.vm, np, plr);', 'int ok = CtSceneSaveState(f.vm, "mem:scene", plr);', 1],
  ['CtSceneSaveState(f.vm, "ct_debug.state", plr);', '', 1],
  ['if (ok) { fieldDebugLogCapture(n, "scene", frameNo, CtSceneMem7E(f.vm), px, py); hostDebugPictures(n); }', '', 1],
  ['CtAudioSaveState(g_fieldAudio, na); CtAudioSaveState(g_fieldAudio, "ct_debug.state.apu");', 'CtAudioSaveState(g_fieldAudio, "mem:apu");', 1],
  ['CtSceneStateLoc("ct_debug.state", NULL)', 'CtSceneStateLoc("mem:scene", NULL)', 2],
  ['double plr[4]; int r = CtSceneLoadState(f.vm, "ct_debug.state", plr);',
    'double plr[4]; int r = CtSceneLoadState(f.vm, "mem:scene", plr); ck_state_load_result(r);', 1],
  ['CtAudioLoadState(g_fieldAudio, "ct_debug.state.apu")', 'CtAudioLoadState(g_fieldAudio, "mem:apu")', 1],
  ['int f5b = dks2[SDL_SCANCODE_F5];', 'int f5b = 0;', 1],
  ['int f9b = dks2[SDL_SCANCODE_F9];', 'int f9b = ck_state_take_load();', 1],
];

const FUNCTION_CHECKS = {
  'ct_vm.c': ['int CtSceneSaveState(', 'int CtSceneLoadState(', 'int CtSceneStateLoc('],
  'audio.c': ['int CtAudioSaveState(', 'int CtAudioLoadState('],
};

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update state-patches.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const prefixed = (belthasar, name) => {
  const text = readFileSync(join(belthasar, 'src', name), 'utf8');
  for (const fn of FUNCTION_CHECKS[name] ?? []) {
    if (!text.includes(fn)) throw new Error(`${name}: ${fn} not found; the engine's state functions moved, update state-patches.mjs`);
  }
  return PREFIX + text;
};

// returns { files: [absolute paths of the patched copies], replaced: [src-relative names they stand in for] }
const writeStatePatches = (genDir, belthasar) => {
  const dir = join(genDir, 'state');
  mkdirSync(dir, { recursive: true });
  const out = {
    'ct_vm.c': prefixed(belthasar, 'ct_vm.c'),
    'audio.c': prefixed(belthasar, 'audio.c'),
    'field.c': applyPatches('field.c', '#include "ck_reconnect.h"\n' + readFileSync(join(belthasar, 'src', 'field.c'), 'utf8'), FIELD_PATCHES),
  };
  for (const [name, text] of Object.entries(out)) writeFileSync(join(dir, name), text);
  return { files: Object.keys(out).map((n) => join(dir, n)), replaced: Object.keys(out).map((n) => `src/${n}`) };
};

export { writeStatePatches }
