// Build-time text patches that give the game module memory-backed save states (reconnect/ck_state.c). The import under
// core/belthasar is never edited: the patched copies are written under out/gen/ and replace the originals in the game
// module only (the oracle keeps the unpatched ones). Every patch is an exact match with an expected count and fails the
// build loudly when upstream's text moves.
//  * ct_vm.c and audio.c: fopen is ck_fopen, which routes the paths "mem:scene", "mem:apu" and "mem:apuh" to linear
//    memory. audio.c's CtAudioSaveState / CtAudioLoadState are wrapped (reconnect/ck_audio_state.inc) to keep the
//    sound's host side (its FIFO, cycle carry and field parity) in a state too.
//  * field.c: main() includes ck_host_state.h (the CtHostState struct and its field table) and runs ck_host_point.inc as
//    the first statement of its loop, the one point where every pre-loop local is in scope: it asks ck_state_top which
//    mode the loop is in, copies the locals into CtHostState for a save and back after a load (host-fields.mjs checks the
//    list against main()'s declarations before patching). The debug keys F5 / F9 are switched off, so the old file-based
//    save, its "[debug] F5" print and the F9 door walk never run; save and load happen only at the safe point.
//  * the overworld section (phase 2): field.c's function-local `static int owIdle` becomes file-scope (WORLD_FIELD_PATCHES,
//    a list of its own) and world.c is copied with reconnect/ck_world_state.inc appended, which hands out the addresses of
//    its cross-frame statics. world-fields.mjs and world-statics.mjs check the World struct, CtWorldStream and both files'
//    statics against the lists in core/reconnect/ck_world_*.h before patching.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkHostFields } from './host-fields.mjs';
import { LOOP_HEAD, MAIN_HEAD } from './main-locals.mjs';
import { checkWorldFields } from './world-fields.mjs';
import { checkWorldStatics } from './world-statics.mjs';

const PREFIX = '#include <stdio.h>\n#include "ck_reconnect.h"\n#define fopen ck_fopen\n';

const F5_PRINT = String.raw`        fprintf(stderr, ok ? "[debug] F5: saved %s (+ _frame/_screen.ppm; and ct_debug.state); logged in ct_debug_log.txt\n"`
  + '\n' + String.raw`                           : "[debug] F5: SAVE FAILED (%s)\n", np);` + '\n';

// [what to find, what to put, how many times it must occur]
const FIELD_PATCHES = [
  [MAIN_HEAD, `#include "ck_host_state.h"\n${MAIN_HEAD}`, 1],
  [LOOP_HEAD, `${LOOP_HEAD}#include "ck_host_point.inc"\n`, 1],
  ['int f5 = dks[SDL_SCANCODE_F5], f9 = dks[SDL_SCANCODE_F9];', 'int f5 = 0, f9 = 0;', 1],
  [F5_PRINT, '', 1],
  ['int f5b = dks2[SDL_SCANCODE_F5];', 'int f5b = 0;', 1],
  ['int f9b = dks2[SDL_SCANCODE_F9];', 'int f9b = 0;', 1],
  [
    '  int w = ((int)(ar[st->widescreen] * CAMH / par + 0.5)) & ~1;\n',
    '  int w = ck_wide_width() > 0 ? ck_wide_width() : ((int)(ar[st->widescreen] * CAMH / par + 0.5)) & ~1;\n',
    1,
  ],
];

// phase 2 (the overworld section), a list of its own so the field patches above merge without it: owIdle, the era placard's
// idle counter, is a function-local static the safe point cannot reach; ck_world_state.h (included before main()) declares
// it at file scope instead.
const WORLD_FIELD_PATCHES = [
  ['      static int owIdle = 0;\n', '', 1],
];
// world.c gets reconnect/ck_world_state.inc appended: it hands out the addresses of the statics the section keeps.
const WORLD_SUFFIX = '\n#include "ck_world_state.inc"\n';

// audio.c: the engine's two state functions become static and ck_audio_state.inc (appended) wraps them with the host
// side of the sound (the FIFO, the cycle carry, the field parity), which the engine's load resets.
const AUDIO_PATCHES = [
  ['int CtAudioSaveState(CtAudio* a, const char* path) {', 'static int ckAudioSaveEngine(CtAudio* a, const char* path) {', 1],
  ['int CtAudioLoadState(CtAudio* a, const char* path) {', 'static int ckAudioLoadEngine(CtAudio* a, const char* path) {', 1],
];
const AUDIO_SUFFIX = '\n#include "ck_audio_state.inc"\n';

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

const patchedField = (belthasar, root) => {
  const text = readFileSync(join(belthasar, 'src', 'field.c'), 'utf8').replace(/\r\n/g, '\n');
  checkHostFields(text, root);
  checkWorldFields(text, belthasar, root);
  const patched = applyPatches('field.c', `#include "ck_reconnect.h"\n${text}`, FIELD_PATCHES);
  return applyPatches('field.c', patched, WORLD_FIELD_PATCHES);
};

const patchedWorld = (belthasar, root) => {
  const text = readFileSync(join(belthasar, 'src', 'world.c'), 'utf8').replace(/\r\n/g, '\n');
  checkWorldStatics(text, root);
  return text + WORLD_SUFFIX;
};

// returns { files: [absolute paths of the patched copies], replaced: [src-relative names they stand in for] }
const writeStatePatches = (genDir, belthasar, root) => {
  const dir = join(genDir, 'state');
  mkdirSync(dir, { recursive: true });
  const out = {
    'ct_vm.c': prefixed(belthasar, 'ct_vm.c'),
    'audio.c': applyPatches('audio.c', prefixed(belthasar, 'audio.c'), AUDIO_PATCHES) + AUDIO_SUFFIX,
    'field.c': patchedField(belthasar, root),
    'world.c': patchedWorld(belthasar, root),
  };
  for (const [name, text] of Object.entries(out)) writeFileSync(join(dir, name), text);
  return { files: Object.keys(out).map((n) => join(dir, n)), replaced: Object.keys(out).map((n) => `src/${n}`) };
};

export { writeStatePatches }
