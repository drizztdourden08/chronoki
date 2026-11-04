// Source lists for the two modules, read from the imported Belthasar's own CMakeLists.txt (the source groups, not a
// copy of them), so a new pin brings its new files. A file the CMake lists but the import dropped (the SDL frontends the
// reconnect layer replaces, the generated tables) is skipped; one the reconnect layer does not replace is reported.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
// the worktree has no import of its own (core/belthasar is git-ignored): fall back to the main checkout's
const belthasarCandidates = [join(root, 'core', 'belthasar'), join(root, '..', '..', '..', 'core', 'belthasar')];
const belthasar = belthasarCandidates.find((d) => existsSync(join(d, 'CMakeLists.txt'))) ?? belthasarCandidates[0];

// what the reconnect layer stands in for (its own file is listed in reconnectSources)
const replaced = new Set([
  'src/present.c', 'src/present_vk.c', 'src/settings.c', 'src/touchpad.c', 'src/launcher.c', 'src/launcher_ui_stub.c',
  'src/launcher_ui.cpp', 'src/overlay.cpp', 'src/android.c', 'src/viewer.c',
  'src/sound/coro.c', // ucontext coroutines: coro_wasm.c, on JSPI (docs/p3-findings.md, unknown 1)
]);

const cmake = () => readFileSync(join(belthasar, 'CMakeLists.txt'), 'utf8');

const setBlock = (text, name) => {
  const m = new RegExp(`set\\(${name}\\s([\\s\\S]*?)\\)\\s*\\n`).exec(text);
  if (!m) throw new Error(`CMakeLists.txt: set(${name} ...) not found; the pin's layout changed`);
  return m[1].replace(/#[^\n]*/g, ' ');
};

const snesGlob = () =>
  readdirSync(join(belthasar, 'snes'))
    .filter((f) => f.endsWith('.c'))
    .sort()
    .map((f) => `snes/${f}`);

const expand = (tokens) => tokens.flatMap((t) => (t === '${SNES_SRC}' ? snesGlob() : [t]));

const tokens = (block) => block.split(/\s+/).filter(Boolean);

const execBlock = (text, target) => {
  const m = new RegExp(`add_executable\\(${target}\\s([\\s\\S]*?)\\n\\)`).exec(text);
  if (!m) throw new Error(`CMakeLists.txt: add_executable(${target} ...) not found`);
  return tokens(m[1].replace(/#[^\n]*/g, ' '));
};

const gameSources = () => {
  const text = cmake();
  const listed = expand(tokens(setBlock(text, 'CT_FIELD_SRC')));
  const kept = [];
  const missing = [];
  for (const f of listed) {
    if (replaced.has(f) || f.startsWith('src/xlat/') || f.startsWith('src/data/')) continue;
    if (existsSync(join(belthasar, f))) kept.push(f);
    else missing.push(f);
  }
  if (missing.length) throw new Error(`in CMakeLists.txt but not in the import: ${missing.join(', ')}`);
  // overlay_stub.c is in the CMake's no-ImGui branch; the import keeps it. datapack.c and the table storage (the
  // CT_DATAFREE additions) come from shapes.mjs, patched for wasm32.
  return [...kept, 'src/overlay_stub.c'];
};

// The full ct tool (add_executable(ct ...)): every mode of main.c, no CT_ORACLE_ONLY. src/sound/coro.c is the reconnect
// layer's (coro_wasm.c); src/xlat/*.c is not in the import (xlat_stubs.c stands in); any other missing file is an error.
const ctSources = () => {
  const kept = [];
  const missing = [];
  for (const f of expand(execBlock(cmake(), 'ct'))) {
    if (replaced.has(f) || f.startsWith('src/xlat/')) continue;
    if (existsSync(join(belthasar, f))) kept.push(f);
    else missing.push(f);
  }
  if (missing.length) throw new Error(`ct in CMakeLists.txt but not in the import: ${missing.join(', ')}`);
  return kept;
};

const reconnectSources = [
  'sdl_clock.c', 'sdl_events.c', 'sdl_window.c', 'sdl_audio.c', 'sdl_gamecontroller.c',
  'present_reconnect.c', 'settings_reconnect.c', 'touchpad_reconnect.c', 'launcher_reconnect.c', 'coro_wasm.c', 'ck_state.c',
  'ck_state_box.c', 'ck_state_host.c', 'music_tap.c',
].map((f) => join(root, 'core', 'reconnect', f));

const hostSources = ['ck_api.c', 'ck_loop.c', 'ck_info.c'].map((f) => join(here, f));

export { belthasar, gameSources, ctSources, hostSources, reconnectSources, root }
