# ChronoKi port research (2026-11-03)

Read-only research. Effort numbers are my estimates, not sourced, unless marked. Anything I could not confirm is under "Not confirmed".

## Part A: RotP (X:/relic-of-the-past)

Sources read: CLAUDE.md, README.md, docs/architecture/{overview,asset-extraction,wasm-bridge,rendering-pixel-art}.md, docs/getting-started/importing-a-rom.md, docs/contributing/testing.md, core/wasm-build/*, node_modules/@drizztdourden08/brock-plugin-snes/README.md.

### What it ports from
- The **zelda3 C decompilation by snesrev**, vendored under `core/zelda3/` (MIT, (c) snesrev / elzo_d). RotP does not write its own game core. `core/game-hooks/` is its own C glue (`Wasm*` exports, `GameHook_*` callbacks), `core/wasm-build/` the Emscripten build (SDL2 init, main loop, SDL audio/input; `emscripten_main.c`, `emscripten_sdl.c`).
- The C core is compiled to **WebAssembly with Emscripten** (`zelda3.js/.wasm`), pinned SDK in `third_party/emsdk`. The wasm auto-builds (`ensure-wasm` pre-step) when missing or any C source is newer.

### Stack and layout
- Electron shell + React 19 renderer. A **Brock app** (build, launch CLI, lint standard, thread/board CLI) drawn with **Tessera** (primitives/composites; missing piece = Tessera request). pnpm workspace.
- Layers: `core/` (C, wasm) -> `packages/game-core` (WASM bridge Facade; the only place with raw `ccall`/`HEAPU8`) -> domain packages `@rotp/*` (no React, no Electron) -> `apps/desktop` (Electron main/preload + renderer) and other apps (sanctuary, store, APIs, kill-switch).
- Packages: asset-extraction, game-data, hub-contracts, features, input-mapping, game-core, roms, languages, msu, packs, randomizer, navigation, hud, hub-*, design.
- 9 recorded dependency invariants (docs/architecture/overview.md): e.g. nothing depends on an app, Node-only code behind `./node` subpath, WASM reached only via game-core, dataset has one door.
- Boundary rule "2-place rule": a C<->JS function touches the C impl (`EMSCRIPTEN_KEEPALIVE`, auto-exported, no export list) and the `ccall` site. JS->C via `ccall`; C->JS via `EM_ASM(window.__on...)`. Structs cross as a static buffer + pointer read from `HEAPU8`.

### ROM supply and extraction
- App ships no game data. User imports their US ROM once (title-bar Data > ROMs, or URL); copied into app data dir; SHA-1 validated (wrong ROM fails loudly); `.smc` copier header stripped.
- Extraction is a **pure-TypeScript port of upstream's Python tools** in `packages/asset-extraction` (rom/ with `snesToLinear`, compression/ LZ+BRR, graphics/ bitplane+palette, one `compile-*` per domain, `asset-builder/` serializes `zelda3_assets.dat`). Runs from the Electron main process on import; takes seconds. The core then loads only the `.dat`.
- Profiles = ROM + language + optional MSU pack. Other-region ROMs are used only to extract translations.

### Rendering, audio, input
- Native frame 256x224 (aspect extension = widescreen via `g_snes_width`), rendered by the zelda3 PPU/DSP code in wasm into a canvas; WebGL used for overlays (edge-glow, probe-webgl). Audio via SDL audio mixer inside wasm (volume exported). Input: SDL keyboard events plus renderer `input-mapping` package, gamepad/haptics polling. Integer-scaling guidance in rendering-pixel-art.md.
- Android build exists (`push:android`).

### Tests / workflow
- Vitest per package, run only touched files; Playwright e2e; test-only launch via `rotp worktree ...` CLI, hidden (`--no-focus --muted`) by default; flags `--auto-state`, `--screenshot`, `--dump-layers`, `--input-script`. Save-state fixture vault (private) via `brock-plugin-snes`. Tests throwaway by default, `.keep.test.ts` permanent only on maintainer ask. `tests/COVERAGE.md` matrix.
- **Brock already has a SNES plugin**: `@drizztdourden08/brock-plugin-snes` 0.117.0 (+ `brock-port-kit`): `snes wasm build`, `snes rom check <file>` (SHA-1 allow-list), `snes vault sync|status`, provision steps `snes.copyAssetBlob()` / `snes.seedSaveStates()`, launch hook `snes.saveStateOf`. Port kit loads raw core states or `PKSV` containers. ChronoKi should reuse this directly.

### Lessons / things to reuse or avoid
- Reuse: the zone map and invariants, bridge Facade, asset-extraction layout, ROM-hash gating, `.dat` container loaded instead of the ROM at runtime, brock-plugin-snes, rotp-style CLI launch rules (never kill electron by image name, hidden launches).
- RotP had a ready decomp; ChronoKi does not (see Part B), so the "vendored C core" box is the part that cannot be copied as-is.
- I did not find a dedicated "lessons learned" doc in RotP's root guide (grepped lesson/pitfall/gotcha/trap); decisions live in plans/*.html (e.g. brock-migration.html, brock-structure.html, archipelia.html) which I did not read. Not confirmed: any recorded RotP board decision on why Emscripten/SDL over alternatives.

## Part B: Chrono Trigger port approaches

### Does a CT decompilation/disassembly exist? Yes: several, all young and one-person/AI-assisted
Contrary to the brief's premise, there is now substantial public work (most dated 2026, so verify before relying):

| Project | What | State (per its README) | Licence | URL |
|---|---|---|---|---|
| **ThisIsAkill/ChronoRET** (site: "Kajar", thisisakill.github.io/Kajar-site) | byte-exact matching disassembly (65816 asm reassembles to identical US 1.0 ROM) | claims 249,251 code bytes = 100% of *reachable* code, 3,736 functions, 23,638 data bytes, SPC700 driver verified; remaining: packed $C3 module (jet-bike race, ~90.6%) and ~3.9 MB of data (music etc.). 825 commits, one person. Survey estimates "tend to be LOW", the 100% is a flow-trace claim. Not C. Wiki has address map, per-system routine pages | MIT; no ROM, build extracts data from user ROM | https://github.com/ThisIsAkill/ChronoRET ; https://thisisakill.github.io/Kajar-site/ |
| **dscotton/ct_disassembly** | 65816 disassembly, asar, byte-identical rebuild | partial (bank files C0..FF + RAM var names + hw regs); 6 commits; others credit its symbols | CC0 (public domain) | https://github.com/dscotton/ct_disassembly |
| **TemplarServant/BelthasarProject** | native **C reimplementation**, zelda3-style: embedded LakeSnes core is an "oracle", C engine verified frame-by-frame against it | boots through title/attract/load, new game in Crono's bedroom; field, battles, menus, shops, overworld, music run on C engine; "not yet verified playable start to finish"; 253/255 enemy fights match; 542 commits; widescreen 16:9/16:10/21:9, 60+ fps interpolation; reads only a locally generated `ct_assets.dat` | MIT (LakeSnes MIT) | https://github.com/TemplarServant/BelthasarProject |
| **ThisIsAkill/ct-recomp** (fork krtp0028/ct-recomp) | **static recompiler** 65816 -> C + C runtime (CPU, bus, scheduler, interpreter fallback), PPU/DMA/APU vendored in third_party/snes | 69.4% (1,414 of 2,036 functions) recompiled; 97.6% of instructions in a 1,500-frame boot run are compiled C; SDL2 frontend with audio; replays into Leene Square and first battle; MSU-1, saves, widescreen only on ROADMAP; 3 of 7 milestones | MIT | https://github.com/ThisIsAkill/ct-recomp ; https://github.com/krtp0028/ct-recomp |
| DocDamage/chronotrigger_disassembly | AI-agent-swarm disassembly workspace | self-reported 1.41% of ROM; inconsistent numbers; low trust | MIT (per link) | https://github.com/DocDamage/chronotrigger_disassembly |
| grabbiel/chrono (ChronoForge) | Swift/macOS RE toolkit + authoring app: LZSS packer, dialogue codec, event bytecode tools, SPC700 emulation | no playable runtime | Apache-2.0 | https://github.com/grabbiel/chrono |

Notes: BelthasarProject, ct-recomp and ChronoRET are AI-assisted and recent; I did not verify claims by building them. None has a release a player can run end-to-end that I could confirm.

### Established documentation (older, human-made)
- **Chrono Compendium** modification section: Temporal Flux docs (Event Encyclopedia, Event Tricks, FAQ), Direct File Access pages (Data Format, Event Commands, Event Command Long Notes, Memory Locations), text lists of locations/NPCs/enemies/sound effects. https://www.chronocompendium.com/Term/Modification (fetch failed once; index seen via search), https://chronocompendium.com/Term/Utilities_(Chrono_Trigger).html, https://pki.chronocompendium.com/Term/Event_Command_Differences.html
- **Temporal Flux** (Geiger/Evil Peer, .NET): event/location/script editor. Geiger's "Offsets Guide" (Memory Locations.txt etc.) maps the ROM. Data Crystal wiki: https://datacrystal.tcrf.net/wiki/Chrono_Trigger , https://datacrystal.tcrf.net/wiki/Chrono_Trigger/Temporal_Flux_Event_Tricks
- **Compression**: CT uses a proprietary LZ-style scheme; Geiger's Chrono Compressor and Bisqwit's ChronoTools (ctdump, ct.cfg, location events from v1.15) implement it. https://iki.fi/bisqwit/source/chronotools.html
- Event commands/temp memory ($7F0200 on SNES) documented; DS/Steam changed event bytes so SNES tooling does not apply to them.
- Not confirmed: exact opcode tables, Map16/tile format, battle/AI script format; I could not open the Data Format and Event Commands pages. Check them directly.

### Other ports and tools
- **zelda3** (snesrev): hand decomp to C, ~80k lines, 19+ contributors, frame/state-checked against an emulator; ships no assets (https://github.com/snesrev/zelda3). Duration not in sources I found.
- **smw** (snesrev): same method; uses LakeSnes-derived PPU/DSP with speed optimizations; runs an emulator in the background and compares RAM each frame (https://github.com/snesrev/smw). Last push Jan 2024 per a third-party listing.
- **snesrecomp** (mstan, now RetroPortingToolKit): game-agnostic static SNES recompiler, 65816 -> C, interpreter tier for what it cannot resolve; PPU/APU/DMA/HDMA/register IO via an embedded snes9x-derived core; builds listed: SMW, ALttP, Mega Man X/X2/X3, Super Metroid, F-Zero, Star Fox preview, Super Mario RPG preview, others; maturity varies, beta; LoROM/HiROM, SA-1, Cx4, SuperFX, DSP-1; **no mention of Chrono Trigger**; framework licence **PolyForm Noncommercial 1.0.0** (a problem for anything but a non-commercial hobby app); data-only `.snesmod` mods; widescreen needs per-game work (https://github.com/mstan/snesrecomp). Related: https://github.com/mitchellcairns/snes-native (Python), https://github.com/alexperez7/snes-recomp (Rust).
- Super Metroid: separate "sm" hand-port by snesrev not confirmed by my searches (SuperMetroidRecomp exists: https://github.com/TechnicallyComputers/SuperMetroidRecomp, a recomp).
- **Kajar Engine** (Schala/KajarEngine): Rust + Bevy engine reimplementation, GPL-3.0, but it targets the **Steam (Cocos2D) port's data**, not SNES; 22 commits, no releases; forbids contributing any disassembly. Not a base for an SNES-ROM port; at most a design reference. (https://github.com/Schala/KajarEngine). Note: "Kajar" is also the name of ChronoRET's wiki site; unrelated to this engine as far as I can tell. Not confirmed.
- **Egg of Time** (power-pudu): static recompilation of the **DS** version (ARM, ~9,000 functions -> C, clang, runtime stands in for DS hardware, ds-decomp for extraction, SDL3). Widescreen, mods, RetroAchievements. MIT, builds from user ROM on first launch. Different CPU and ROM from SNES; useful as a model for the first-run-build UX and for "Claude did the RE" feasibility, not as code (https://github.com/power-pudu/egg-of-time).
- **Emulator cores** (for approach 4): LakeSnes (MIT, small C, archived upstream; fork by Dinkc64; https://github.com/elzo-d/LakeSnes); snes9x (non-commercial licence, plus an Emscripten port exists); bsnes (GPLv3) and ares (ISC) licences from memory, NOT verified in this session. Accuracy order bsnes/ares > snes9x > LakeSnes (from memory).

### Approaches

**(1) Full hand decompilation to C/TS (zelda3 style)**
- What: reconstruct readable C for every routine, verified frame-by-frame against an emulator. Needs the disassembly first.
- Effort (estimate): CT's code is large (~250 KB code per ChronoRET) with a bytecode event VM, a battle engine, and a custom sound driver. zelda3-class work was a multi-year community effort; a lead using AI agents could plausibly reach 12-24 person-months. Hard parts: event VM with 100s of scripted scenes, battle timing exactness, SPC700 music driver (can be left to an APU emulator), PPU effects (mode 7, HDMA, windowing).
- Player gets: best fidelity, widescreen, 60+ fps, mods, small native/wasm core; ROM only for assets (as RotP).
- Legal: no ROM in repo; extraction at runtime; derived code is a clean reimplementation (the zelda3 posture); do not commit disassembly output containing ROM bytes (ChronoRET commits asm only, data from user ROM).
- Leans on: ChronoRET asm + symbols (MIT), dscotton labels (CC0), **BelthasarProject (MIT, already in C, partly working: could be adopted/forked or used as the starting point)**, Compendium/Temporal Flux docs, LakeSnes oracle.

**(2) Static recompilation of 65816 to C/TS with a PPU/APU runtime**
- What: tooling translates the ROM's code to C at build time (on the player's machine). ct-recomp does this for CT.
- Effort: lowest per-routine work, but needs good function-boundary/indirect-jump data (the ChronoRET function list helps) and a validated runtime. ct-recomp reports 69% of functions done; est. 3-6 person-months to finish and harden, 6+ for features. Hard parts: indirect dispatch (event VM, battle tables), self-modifying code or RAM-resident code, M/X flag tracking, cycle timing, the packed $C3 module, SPC700 driver run in an APU emulator.
- Player gets: original behaviour, widescreen/mods only through hooks into memory/PPU (per-game integration, see snesrecomp note); generated C is not human-readable, so deep mods are harder than (1).
- Legal: best posture, generated code never distributed; user builds from own ROM (Egg of Time model). Needs a compiler on the user's machine or a build step shipped with the app. Avoid snesrecomp's framework licence (non-commercial) if a clean licence matters.
- Leans on: ct-recomp (MIT), ChronoRET symbols, LakeSnes/vendored PPU+APU, brock-plugin-snes (wasm build, ROM check).

**(3) High-level reimplementation reading data from the ROM (Kajar-style)**
- What: write a new engine (maps, events, sprites, battle, music) that interprets the game's data formats directly instead of running 65816 code.
- Effort: highest design risk and likely longest (est. 18-30 person-months to reach full fidelity): needs full event-bytecode VM, battle rules, AI scripts, Mode 7 etc., all re-derived and checked. Hard parts: bug-for-bug behaviour, sound (SPC700 data/driver must still be run or reimplemented).
- Player gets: cleanest modding and platform reach (any resolution, HD, TS-native), but fidelity depends on testing.
- Legal: clean, as RotP. Kajar Engine (Steam data) is not a base for this (different data formats; DS/Steam event formats differ); but the SNES formats are documented (Compendium).
- Leans on: Compendium/Temporal Flux/Geiger offset docs, ChronoRET data layer, BelthasarProject's extraction tooling and `ct_assets.dat` design.

**(4) Embedded accurate emulator core in a Brock/Tessera shell**
- What: ship snes9x/bsnes/ares/LakeSnes (native or wasm), user's ROM loaded directly, Tessera UI around it, enhancements via hooks (widescreen is hard in a pure emulator; save states, rewind, controllers, shaders, achievements are easy).
- Effort: lowest (est. 1-2 person-months to a playable Electron milestone). Hard parts: licence choice (bsnes GPLv3 would make the whole app GPL-3; snes9x is non-commercial; LakeSnes/ares permissive but less accurate/maintained), audio latency in wasm, input/save plumbing.
- Player gets: original fidelity, no widescreen/mod depth unless hooks into RAM/PPU are added.
- Legal: ROM is user-supplied and loaded at runtime, nothing extracted into the repo; widely accepted posture; avoid shipping any BIOS-like data (none for SNES).
- Leans on: brock-plugin-snes/port-kit, RotP's Electron/React shell, game-core Facade pattern, an emulator core.

**(5) Hybrids (emulator first, then replace subsystems)**
- What: milestone 1 = approach 4 with a LakeSnes/similar core; then use it as the **oracle** (the zelda3/smw/Belthasar method) while replacing routines with C (1) or recompiled output (2), one subsystem at a time (field, battle, menus, music), checking frame-by-frame against the emulator. This is exactly how BelthasarProject and smw work.
- Effort: low to start, incremental risk, total roughly that of (1) or (2) but always shippable. Hard parts: boundary between emulated WRAM/VRAM state and the native engine, keeping a build that runs both.
- Player gets: playable from month 1; widescreen/60 fps/mods arrive as subsystems are replaced.
- Leans on: all of the above; best fit with RotP's "oracle" idea and Brock's save-state fixture vault.

### Recommendation hook for the lead (my read, for the lead to weigh)
Approach 5 starting from a permissively-licensed core, with BelthasarProject (MIT) and ct-recomp (MIT) as the nearest existing work to evaluate, and ChronoRET as the symbol/doc source. Before committing: build and run those repos with a legally obtained ROM to verify their claims, and check their licences and commit history for provenance (all are recent, few contributors, AI-assisted).

### Not confirmed
- Whether any of the 2026 CT projects is playable start to finish (all say no or do not claim it).
- Exact licence terms of bsnes/ares (recalled, not fetched); snes9x exact licence text; LakeSnes accuracy limits for CT.
- Person-month figures above are estimates, not sourced.
- Super Metroid snesrev port existence; zelda3 total duration.
- Contents of Chrono Compendium Data Format / Event Commands pages (fetch failed).
- Whether "ChronoKi" could collide with these projects' names (not searched here; naming is out of scope).

## Addendum (2026-11-03, from the coordinator's GitHub API check; details in chronoki-recent-ports.md)

Corrections and additions to the project table:
- **zdiemer/chrono-trigger-reimplemented** (https://github.com/zdiemer/chrono-trigger-reimplemented): created 2026-09-14, 1,232 commits, 12 stars. Hand-written readable C ported routine by routine, validated frame by frame against a 65816 interpreter on 26 input movies; a C generator covers the rest. WIP (attract, field, menu, event, battle partly native). **No licence file: its code cannot be reused** (idea and method only). I had not found this one.
- **BelthasarProject**: the README I fetched says MIT (vendored LakeSnes MIT), but the API listing shows the licence as unclear. Treat as unconfirmed: open LICENSE in the repo and check file headers before any reuse; if there is no LICENSE file, treat as all-rights-reserved.
- **ChronoRET** (MIT) created 2026-08-07, pushed 2026-10-30. **Egg of Time**: v0.7.0 on 2026-11-03, 82 stars, 57 commits, playable from the start (DS, MIT source). **fariasheron/cronotrigger-decomp**: C decomp (~2,000 routines) on the snesrecomp runtime, PolyForm Noncommercial 1.0.0, 1 commit, 0 stars: **non-commercial only; do not build ChronoKi on it** unless the owner accepts a non-commercial licence. Minor/unverified: grabbiel/chrono, ct-rebuild/ct-rebuild, omegakatana92/Chrono-Trigger-Recomp. No takedowns found for any 2026 project.
- ct-recomp (ThisIsAkill, MIT) is as in the table above; the krtp0028 fork is MIT too.

### Per-approach: what it can build on, work saved, licence constraint

| Approach | Can build on | Own work saved (estimate) | Licence constraint |
|---|---|---|---|
| 1. Hand decomp to C/TS | ChronoRET asm + symbols + Kajar wiki address map (MIT); ct_disassembly labels (CC0); Belthasar C (if MIT confirmed); zdiemer C as a reference only | Disassembly phase is essentially done by ChronoRET: saves the largest early block (roughly 4-8 person-months of the 12-24). Belthasar, if MIT, could save much of the rest | zdiemer: none (no licence = no reuse; write from ChronoRET instead). Belthasar: confirm. ChronoRET commits asm/structure only, data comes from the user's ROM |
| 2. Static recomp | ct-recomp (MIT, 69% functions), ChronoRET function list/symbols; Egg of Time as an architectural model (MIT) | Recompiler core and runtime already exist: saves perhaps 2-4 of the 3-6 months; remaining = last 30% functions, interpreter-fallback removal, hooks | Avoid snesrecomp and fariasheron's decomp (PolyForm Noncommercial). ct-recomp's vendored PPU/APU core licence not identified: check third_party/snes + THIRD_PARTY.md |
| 3. High-level engine from ROM data | ChronoRET data layer + Kajar wiki, Compendium/Temporal Flux docs; Belthasar's asset extraction and ct_assets.dat design (if MIT); Egg of Time's mod/UX ideas | Little code reuse (new architecture); saves research time on data formats (about 2-4 months) | Docs are not code: formats can be reimplemented freely; KajarEngine is GPL-3 and reads Steam data (do not copy into a non-GPL app) |
| 4. Embedded emulator in Brock/Tessera shell | Any emulator core (LakeSnes MIT is what Belthasar and smw use); brock-plugin-snes; RotP shell | No CT-specific project needed; already minimal | Pick the core licence deliberately (bsnes GPLv3 / snes9x non-commercial are viral/limiting) |
| 5. Hybrid emulator -> replace subsystems | Belthasar (same oracle method, MIT-if-confirmed), zdiemer (same method, no licence: method only), ChronoRET symbols to locate subsystems | Method and oracle harness proven twice; saves harness design (about 1-2 months) and, with Belthasar, whole subsystems | Same as 1 and 4 |
| 6. NEW: contribute to / build on an existing project instead of starting our own | Best candidates by licence and state: **Belthasar** (C, widescreen, 60+ fps, field/battle/menus/music, 30 stars; confirm licence), **ct-recomp** (MIT), **ChronoRET** (MIT, as the knowledge base), **Egg of Time** (DS, MIT, already playable, v0.7.0, mods/shaders; only relevant if DS version is acceptable) | Saves the most: potentially most of the engine; remaining work becomes Brock/Tessera Electron shell, ROM import/extraction UX, packaging, testing, upstream PRs | Need upstream agreement and a clear licence. Fork risk: projects are weeks old, 1-2 authors, AI-assisted, and may be unmaintained or taken down; zdiemer (no licence) and fariasheron (PolyForm NC) are not usable as bases. Vendoring an MIT project keeps ChronoKi free to ship a shell around it, but ChronoKi should keep the ROM-side extraction in its own TS package as RotP does |

Honest note on option 6: the owner's stated goal is "RotP-style" (own packages, Brock/Tessera app). Building the shell around an upstream C core (as RotP does with zelda3) is the closest analogue: RotP vendors snesrev's core and adds hooks. Belthasar plays the zelda3 role if its licence and quality check out. That is a decision to confirm by actually building it with a ROM.
