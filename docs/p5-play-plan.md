# P5 "Play" (I-15): implementation plan

Designed 2026-11-04 (plan agent A-42). Lead decisions are at the end.

## Architecture

- **Core in the renderer main thread**, as in RotP:
  - `createGameCore(CHRONOKI_PORT, {precompiled, crashArmDelayMs: 200, watchCrashFrom: 'start', onCrash})`, then
    `createPortSession({core, canvas, files, romFile, profileId, settings, config, volume, log})`.
  - Each rAF tick (port-kit `createFrameLoop`):
    1. `CkRunFrame()` adds one credit and moves the clock on by 1/60 s; the JSPI engine resumes in a microtask, so video
       runs one frame behind.
    2. `CkSampleCount`/`CkSamplesPtr` are drained into `createAudioAdapter` (48000 Hz, S16 stereo, about 800 frames per
       engine frame).
    3. The 256×224 RGBA framebuffer is presented through `createFramePresenter`.
- **Input**:
  - A trimmed RotP `InputManager` polls the brock-input SDL3 addon (desktop) or the Capacitor plugin (Android).
  - It builds the 12-bit SNES mask and sends it with `core.calls().call('CkSetInput', mask)`.
  - touchpad_reconnect.c maps that mask to `CT_BTN_*`.
- **Boot**: port-kit `bootCore` writes `/ct_assets.dat`, `/ct_settings.ini` and `/saves/ct_sram.srm` in `preRun`. It never
  calls `callMain`, so the game target is built with `-sINVOKE_RUN=1`.
- **Importer**:
  - Runs in a renderer Web Worker on every platform (`runAssetWebWorkerJob` + `serveAssetSteps`, as in RotP's
    extraction-client.ts).
  - The renderer passes it the oracle `.wasm` and the kit JSON (recipes, manifests, shapes; generated at build time from
    core/belthasar/tools).
  - The oracle glue is built with `EXPORT_ES6`.
- **userData** (RotP split, under `Data/`):
  - `roms/<keepFileName>`
  - `assets/<rom>.dat`
  - `profiles/<id>/{profile.json, config.json, input-profiles.json, sessions.json, saves/{sram.dat, sram.bak, quick/, normal/, auto/}}`
  - `input/` (brock-input)
  - `/ct_settings.ini` is regenerated on every start and never stored.

## Pieces and coder tasks

| Task | Piece | Main files | Depends on |
|---|---|---|---|
| T1 | C exports and build | core/wasm-build/{ck_api.c, ck_loop.c, build.mjs, probe/frames.mjs}, core/reconnect/sdl_events.c | none |
| T2 | Port definition | packages/game-core/src/port/*, deletes save-paths/* | none |
| T3 | Input mapping | packages/input-mapping/src/* (classic subset of RotP's) | none |
| T4 | Game lifecycle, SRAM sync, save states | apps/desktop/src/game/{lifecycle, sram-sync, save-states}/* | T2, T1 names |
| T5 | Input wiring and Controls screen | apps/desktop/src/input/*, screens/game/gameplay/controls.custom.tsx | T3 |
| T6 | Import and Library | apps/desktop/src/storage/*, game/extract-assets-worker.ts, views/Library/* | T2, T1 names |
| T7 | GameView, automation, workspace | GameView/*, GameLayer/*, electron/automation/*, launch-flags/*, src/index.html CSP, brock.workspace.mjs | T2, T4 |
| T8 | Capacitor parity | apps/desktop/capacitor.config.json, apps/desktop/mobile/android/, game/lifecycle/platform-gate.ts | T4 |

T1 details:
- `CkSaveState(slot)` and `CkLoadState(slot)` queue a synthetic F5/F9 edge.
- `CkStateStatus()` reports the result.
- The game is built with INVOKE_RUN=1 and the oracle with ES6 output; the output goes to apps/desktop/public/wasm.
- It emits `ck_kit.json`.
- frames.mjs writes its files in `preRun` and must present at least 600 frames.

Save states (T4):
1. Call `CkSaveState`.
2. Poll `CkStateStatus` for up to 4 presents.
3. Read `/ct_debug.state` and `.apu`, then delete the debug files.
4. Wrap the result in CKST, then PKSV, with a screenshot.

## Hidden-launch test (the lead runs it)

```
npx brock-thread launch main game --prod --auto-start --screenshot=title --probe-frames=600 --event-log=.user-data/Data/logs/p5.jsonl
```

The first launch of the main checkout provisions `.user-data` (profile, then the ROM and the pack from `test-roms/`, via
the `provision` steps in `brock.workspace.mjs`; the pack is staged by `snes.copyAssetBlob({ asset: 'ct_assets.dat' })`, Brock 0.120.0), but only if `.user-data` does not exist yet. If an earlier launch already
created it empty (Data tab shows "No ROM added yet"), delete the git-ignored `.user-data` folder once, then launch again.

It passes when:
- p5.jsonl shows `presented >= 600` at 256×224, about 800 audio frames per presented frame, `coreStatus: running` and no
  errors;
- title.png is not black.

Second launch: `--probe-state --screenshot=state` (quick save and load in the field; the screenshot flag makes the app quit when the probe ends). Input launch: `npx brock-thread launch main game --prod --auto-start --probe-input --screenshot=input --event-log=.user-data/Data/logs/input.jsonl`
(real key events through the input manager and `CkSetInput`; logs `{"probe":"input"}` with the masks seen and the frame hash before and after).
SRAM launch: the same with `--probe-sram --screenshot=sram` and `sram.jsonl` (writes a test pattern into the core's SRAM file, flushes through the
SRAM sync, reads the profile's saved file back, restores the original; logs `{"probe":"sram"}`). Import is not a launch probe (there is no `--probe-import` flag); the importer is run through the CLI (`node --experimental-wasm-jspi packages/asset-extraction/src/cli/import.ts --rom ... --belthasar ... --abi native64|wasm32 --out ... --work ... [--only ids] [--from id]`), expected to fail until
P4 is verified.

The pack staged in test-roms/data is git-ignored and never committed.

## Lead decisions on the open points

1. **Save states**:
   - They are field-scene only for now.
   - The UI is enabled only while `CkStateAvailable()`; otherwise it shows "Not available here".
   - A whole-core snapshot is a later item, not P5.
2. **Importer**: a Web Worker everywhere, as RotP does today. This replaces the accepted plan's Node worker on desktop.
   `runAssetWorkerJob` is kept as the fallback.
3. **Screenshot watchdog**: the probe starts at 300 frames. If the watchdog is too short, ask Brock to make it
   configurable.
4. **Frame size**:
   - Fixed 256×224 for P5; a mismatch with `CkFrameWidth` is logged.
   - A dynamic framebuffer is a Brock request before P6 widescreen.
5. **Exit**: `ExitStatus` with status 0 is not a crash.
6. **CSP**: add `'wasm-unsafe-eval'` to script-src (T7).
7. **Audio**: count audio frames from `CkSampleCount`, not from playback.
8. **Android**: structure only in P5; JSPI in WebView is checked in P7.
9. **Legal**: the kit JSON and staged packs are git-ignored (T1, T7).
