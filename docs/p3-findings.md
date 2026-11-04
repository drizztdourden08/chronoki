# P3 findings: Belthasar in WebAssembly

Status: written, not yet built or run (the coder does not build). Every claim below marked *hypothesis* is for the
checker to confirm with `node core/wasm-build/build.mjs`, `probe/frames.mjs` and `probe/oracle.mjs`.

## What exists

- `core/reconnect/`: `SDL.h` (the 38 SDL functions `field.c` calls, plus the types and constants) and its C bodies:
  virtual clock, no events, a window of fixed size, an audio device that is a linear buffer, no controllers. It also
  holds the replacements for the sources the import drops: `present_reconnect.c` (RGB24 to RGBA, swap = yield),
  `settings_reconnect.c` (parses `/ct_settings.ini`), `touchpad_reconnect.c` (the input channel),
  `launcher_reconnect.c` (argv becomes `--assets /ct_assets.dat --boot`; env `CT_SRAM=/saves/ct_sram.srm`).
- `core/wasm-build/`: `build.mjs`, `sources.mjs` (file lists read from Belthasar's own `CMakeLists.txt`: the
  `CT_FIELD_SRC` group, the `${SNES_SRC}` glob, the `ct_oracle` target), `shapes.mjs`, `ck_api.c`, `ck_loop.c`, and
  `probe/`. Output in `core/wasm-build/out/` (git-ignored): `chronoki-core.{js,wasm}` (factory `ChronoKiCore`) and
  `chronoki-oracle.{js,wasm}` (factory `ChronoKiOracle`). Nothing from the engine, ROM or data is embedded.
- Both modules need the shell to fill the file system first, so `INVOKE_RUN=0`: the shell writes `/ct_assets.dat`
  (and `/ct_tables.dat` if separate), `/ct_settings.ini`, `/saves/`, then calls `callMain([])` and does not await it.

## Unknown 1: the blocking loop (hypothesis: go)

`field.c` `main()` loops forever: events, sound, logic, `CtPresentSwap`, pace. Port-kit's host loop calls `runFrame`
synchronously (`ccall`, no await) and then reads the frame. A JSPI-suspended call cannot be that call, so:

- `main` is the only JSPI export (`-sJSPI -sJSPI_EXPORTS=main`). `CtPresentSwap` calls `ck_yield_to_host()`, which
  awaits a promise (`EM_ASYNC_JS`, `ck_loop.c`) while no frame credit is held.
- `CkRunFrame` is a plain sync export: it moves the virtual clock one 1/60 s tick, adds a credit and resolves the
  promise. The engine resumes in a microtask once the host's stack unwinds, runs one frame, parks at the next present.
- Cost: a constant one frame of video latency (the host reads the frame the previous call produced); catch-up steps
  make the engine run frames back to back. `CkSampleCount` consumes the audio accumulated (reset on read), so audio
  is neither doubled nor lost under catch-up. Backlog is capped at 8 credits.
- Pacing: `SDL_GetPerformanceCounter` is virtual (1 MHz), `SDL_Delay` advances it, `CkRunFrame` sets it to the frame
  tick. The engine's `hostPaceDo` therefore never decides a present is late, so it never skips one. `CT_NOPACE` is
  not set because it makes `g_hostInteractive` false (settings would not load); the video driver reports `chronoki`.
- Risks the checker settles: Node 24's V8 needs `--experimental-wasm-jspi` (the probe re-runs itself with it; browsers
  that ship JSPI do not); `-sJSPI_EXPORTS=main` with `INVOKE_RUN=0` and `callMain` is unverified; a JS-to-wasm frame
  between `main` and the yield (none known) would trap. Fallback: Asyncify with `emscripten_fiber_swap`, same
  `ck_yield_to_host` seam.

**The sound coroutine (decided: a JSPI stack, `core/reconnect/coro_wasm.c`).** `src/sound/coro.c` (ucontext) does not
link: emscripten has no `getcontext`/`makecontext`/`swapcontext`. Its users: one coroutine per `SndMachine`, the
sound driver program (`SndDrvProgram`, 1 MiB stack), resumed by `SndMachineRun` on the main stack and yielding at each
instruction boundary; no nesting, and it never reaches `CtPresentSwap`. It switches often: a few times a frame, about
10,000 times a song upload (one per port handshake). emsdk 5.0.7's fibers are Asyncify only (`emscripten_fiber_swap`
calls `asyncify_start_unwind`), and Asyncify excludes JSPI; moving the module to Asyncify would instrument nearly
every function (indirect calls everywhere) and unwind main's whole stack per switch. The reference SPC
(`CT_AUDIO_SPC_DEFAULT=0`) needs no coroutine but drops the game's own sound machine. So `coro_wasm.c` implements
`coro.h` on JSPI: `ck_coro_entry` is a second JSPI export, a resume or yield is a suspending import that resolves the
other side's promise (O(1) a switch, two microtask hops), and each side restores its own `__stack_pointer` on waking
(the coroutine runs on its own 1 MiB block). `sources.mjs` drops `coro.c`. Risks: nested JSPI (a promising export
entered from inside a suspending import's JS) and the per-switch promise cost during uploads, both unmeasured;
`-sSTACK_OVERFLOW_CHECK=2` must stay off (the limits are not swapped).
Found by the first 32-bit probe (0 presents, no error): `SndDrvProgram` calls `setjmp`, and emscripten's JS setjmp
puts an `invoke_*` JS frame under every call it makes, so each yield hit that JS frame. The yield's JS had already woken main
and cleared `fail`, so the SuspendError was lost and main waited forever on the next resume. The build now uses Wasm-EH
setjmp (`-fwasm-exceptions -sSUPPORT_LONGJMP=wasm`, legacy EH), which has no JS frame; `coro_wasm.c` keeps a dead
coroutine's error and throws it at the next resume.

## Unknown 2: the 32-bit table layout (hypothesis: the 64-bit reference pack does not load in wasm32)

`datapack.c` checks the pack header's pointer size against `sizeof(void*)` (8 against 4: refused), then per table the
size and a layout hash, reads each pointer slot as a `u64` (UINT64_MAX = NULL) and relocates strings out of the pool.
`src/tables/tables_storage.c` is generated for the 64-bit model: 398 `CT_TBL_CHECK` compile-time asserts, baked
`elemSize`, layout hashes and pointer offsets. Only about eleven tables carry `const char*` members
(`ctBattleAnimKf`, `ctMarleAtkKf`, `ctBattleSettleKf`, `ctBattleStanceActor`, `ctCronoIdleAddKf`, `ctGatoAtkFace`,
`ctGatoFaceKf`, `ctGatoSwipeKf`, `ctLoaderChapter`, `ctLoaderEra`, `ctMarleSparkKf`); every other table has the same
layout in both models. A wasm32 core needs three things:

1. a 32-bit pack: `tools/gen/pack_tables.py` with `PTR_SIZE = 4`, `NULL_OFF = 0xFFFFFFFF`, `'<Q'` to `'<I'` for the
   slots (a patched copy executed with `__file__` set to the real path; the kit's bundled python runs it);
2. a regenerated `tables_storage.c` (its `headers` command with the same patch) so sizes and layout hashes match;
3. the pointer-slot read in `datapack.c`. `shapes.mjs` applies an exact-match text patch (u32 slot when
   `sizeof(void*) == 4`) and fails the build if the upstream line changes.

Until (1) and (2) exist, `shapes.mjs` compiles the imported storage with the `CT_TBL_CHECK` lines stripped; the module
links, and `frames.mjs` prints the loader's message (pointer size or "another layout") and exits 2. Put a generated
32-bit storage at `core/wasm-build/out/tables32/tables_storage.c` and it is used instead. The alternative,
`-sMEMORY64=1`, keeps the reference pack but needs wasm64 in the browser (not on every mobile browser). The longer
fix is the TypeScript pack writer planned for P4, emitting the pointer size the target asks for.

## Unknown 3: src/data and src/xlat shapes (hypothesis: not needed for the game)

The data-free import already carries `src/tables/*.h`, which declare every table through `CT_TBL_EXTERN` /
`CT_TBL_CONST`; the game target compiles against those. `CT_XLAT_NO_GWARP` is defined and the other `xlat` switches are
not, so no `src/xlat/*.c` is needed. The one generated shape is for the oracle: `main.c` includes
`data/animeng_sheet_gato.h` unconditionally; `shapes.mjs` writes a zeroed same-shape header to `out/gen/data/`.
`sources.mjs` skips CMake-listed files the import dropped and stops with a list if anything else is missing.

## Unknown 4: mod state and save states (hypothesis: no gate words in WRAM)

Belthasar's mods (widescreen, scene adjustments, Steam margins, fill bottom lines, interpolation, render scale, free
sync, instant sound uploads) live in the host `CtSettings` struct, not in WRAM; with them off the game is the
cartridge's. So, unlike RotP, no gate words need freezing in a save state: the gates are the options in
`ct_settings.ini`, applied once at start (an option marked `live:false` in the shell needs a core restart).
The engine has no whole-core snapshot: F5/F9 (`CtSceneSaveState`) are scene-level, and an in-game save writes
`/saves/ct_sram.srm` itself. Hence `CkSaveSram` returns 1 (the shell persists that file) and
`CkSaveState`/`CkLoadState` return 0 for now. Later options: an engine hook that serialises the machine, or a heap
snapshot (fragile under JSPI). A save-state container must record the option set so a load can refuse or re-apply it.

## Other things the lead should know

- Audio is 48000 Hz S16 stereo (800 frames per engine frame), not 32000: the port definition's `sampleRate` is 48000.
- The frame is RGB24 of a variable size (widescreen, render scale); it is converted to RGBA. Extra exports
  `CkFrameWidth`/`CkFrameHeight`/`CkFrameCount` carry the size; port-kit's fixed frame size must follow them.
- Input is the touch-pad channel: `CkSetInput` takes port-kit's SNES 12-bit mask and remaps it to `CT_BTN_*`;
  `field.c` derives the edges. `SDL_PollEvent` is always empty.
- `CT_ROM` is not set; the checker should confirm the data-free engine boots from the assets alone (hypothesis: it does).
- emcc comes from the emsdk RotP uses (`X:/relic-of-the-past/third_party/emsdk`; `--emsdk`, `CHRONOKI_EMSDK` or
  `third_party/emsdk` override). A port-kit `portKit.wasm` entry in `apps/desktop/package.json` is not part of P3.

## The WASM oracle driver (I-13)

`packages/asset-extraction/src/oracle/wasm/` (`createWasmOracle`, exported from the package) implements OracleDriver,
OracleTools, PeekOracle, ToolOracle and CpuTraceOracle on `chronoki-oracle.{js,wasm}`. Each ct.exe invocation is one
`callMain` on a fresh module (the ROM, state, battery and inputs staged in MEMFS; env set in `preRun`, since libc reads
it once; outputs read back from `/out`). The module factory is injected (`createModule(options)`); `createWasmInstantiator`
compiles the `.wasm` once and hands every instance the same `WebAssembly.Module` through `instantiateWasm`.
To resolve the `boot` clash (OracleDriver.boot(rom) vs the power-on capture), `OracleTools.boot` is now `powerOn` and
`OracleTools.monitor` is `monitorText` (PeekOracle keeps `monitor`).

**The oracle build is the full ct tool (I-13 follow-up).** `build.mjs` no longer defines `CT_ORACLE_ONLY`; `chronoki-oracle`
is `main.c` plus the `add_executable(ct ...)` list from Belthasar's CMakeLists (`ctSources()` in `sources.mjs`, read from the
pin), so `--teleport`, `--owforce/owsprite/owboat/owbirds`, `--cputrace`, `--lzpack`, `--animoplen`, `--sndtiming` are compiled
in. Build shape, as the game target's: `-DCT_DATAFREE -DCT_XLAT_NO_GWARP`, the shapes.mjs `datapack.c` + `tables_storage.c`
(tables32 when present), `-I` src/snes/reconnect/src/tables/gen, `coro_wasm.c` in place of `sound/coro.c`, and
`-sJSPI -sJSPI_EXPORTS=main,ck_coro_entry` (+ `_ck_coro_entry` exported). MODULARIZE, `ChronoKiOracle`, `callMain`, `FS`, `ENV`
and `EXIT_RUNTIME=1` are unchanged. Not in the import: `src/xlat/*.c`, so `core/wasm-build/xlat_stubs.c` defines
`CtXlat_*` (return `CT_XLAT_MISS`) and `CtXlatHdmaBuild` (-1): `--xlatcmp`, `--hdmabuildxlat`, `--hdmafuzz` do not work.
No threads, stdin or sockets are used by the ct list; it needs only MEMFS files (ROM staged as `Chrono_Trigger_USA_SNES.sfc`
for `--animoplen`, states, `--lzpack` list, outputs in `/out`).

**Driver change needed.** With JSPI `callMain` returns a Promise (main is a suspending export): `run-ct.ts` must
`status = (await module.callMain(argv)) ?? 0` (and keep catching a thrown ExitStatus around the await). Unverified: never built
or run (no emcc allowed here); a likely first link error is a symbol from a file the reconnect layer replaced (present/settings).
