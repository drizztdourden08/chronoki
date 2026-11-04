# Save states anywhere (I-68): plan

Design only. Goal: a save state taken in any mode (field, overworld, menus, battle, cutscenes) loads back to
the same moment, with RotP's app-side features (slots, rolling auto and quick saves, thumbnails, the stamp).
Line numbers are against the current pin (BelthasarProject v0.13.0-preview, `core/belthasar.pin.json`).

## 1. What exists today

- `core/reconnect/sdl_events.c` fakes an F5 or F9 key for a few polls; `field.c` (~12453) sees the edge and
  calls `CtSceneSaveState` / `CtSceneLoadState` (`ct_vm.c` ~6698). The state is a raw `memcpy` of the whole
  `CtScene` struct (heap pointers scrubbed, `sizeof` checked, `CT_STATE_VERSION` 4) + the field player
  `{px,py,pz,pfac}` + the 128 KB WRAM image. Audio goes in a sidecar via `CtAudioSaveState`.
- F9 from another scene walks to the state's location first (`CtSceneStateLoc` reads `$0100` of the image),
  because the scene restore is same-scene only.
- Without a scene (overworld) F5 writes only a WRAM + SRAM dump for the debug tools; there is no F9 there.
  Battle, menus, the overworld, the title, the seq_* cutscenes and transitions are not covered.
- The app side is already RotP-shaped: Brock port-kit `encodeSaveSlot` (meta: port, time, ROM) wrapping a
  `CKST` v1 container (sections scene, apu, options; `packages/game-core/src/port/state-container`),
  named slots, auto-save, screenshots (`apps/desktop/src/game/save-states`, `auto-save`, `screenshot`).
  What it lacks is RotP's stamp check (`state-stamp/`: build, format, layout drift, refusal).

## 2. Where Belthasar's mutable state lives

Belthasar is a C rewrite checked frame by frame against an embedded LakeSnes oracle, so the WRAM image is
the authoritative game state for most logic. Around it sit four kinds of C-side state.

1. **The WRAM image** (`Mem` / `CtWram`, `ct_vm.c` ~105): one flat 128 KB block ($7E, then $7F), owned by
   the host for the whole process and shared by the scene VM, the battle (`CtBattleHost.mem/glb`), the
   overworld (`World.wram`) and the audio service. Plus the 8 KB SRAM (`/saves/ct_sram.srm`). This is the
   RotP-like spine: it already exists, and its layout is the SNES game's, so it never moves between builds.
2. **The sound machine**: already serialisable. A coroutine's stack cannot be written down, so
   `sound/machine.c` keeps a restore point plus the host's inputs since, and a load replays them to the same
   cycle ("CTSM"). The vendored-core path has "CTAP". Nothing to design here beyond embedding it.
3. **`main()` in `field.c` (lines 9441-19479, about 10,000 lines)**: the playable host is one blocking loop
   (`while (running ...)`, ~11391) and every mode is a phase inside it: `inWorld`, `battlePhase`,
   `menuPhase`, `gameOver`, `fade/fadeBri`, `pendKind/pendDest` (door and world transitions), `raceOn`,
   the title intro, the gate warp, and so on. Its persistent state is **local variables**: about 230
   declaration lines before the loop, roughly 340 scalars plus struct locals (`Field f`, `World wd`,
   `CtBattleHost liveHost`, `CtMenuShop`, `CtTitleIntro`, menu repeaters, picture buffers such as `menuFb`,
   `menuFrozen`, `menuStash`). Many of them are run config (args, env, settings) or per-frame scratch; the
   rest is the mode machine, and it lives nowhere else.
4. **Statics per subsystem** (file-scope and function-local, non-const, rough counts from a grep):
   field.c ~133 + ~138, battle.c ~13 + ~26, menu.c ~25 + ~10, world.c ~18 + ~10, ct_vm.c ~30 + ~9,
   audio.c ~13 + ~10, scene_art.c ~12, sound/* ~15. (main.c's ~140 belong to the `ct` tool, not the game.)
   They fall into three groups: (a) trace, debug and harness switches from env (most of ct_vm.c's, the
   oracle lock in field.c ~4834): never saved; (b) caches rebuilt from WRAM and the asset pack (menu window
   tiles `mWinTile`, `mSlotTile`, world draw lists, battle line-cut images `gBattleLineCutRam`): rebuilt on
   load, not saved; (c) real cross-frame game state not in WRAM (examples: `g_leadTk`, `g_daRingPend`,
   `g_carrySong` in ct_vm.c, `gDeathScanPend`, `gBattleNmiLine` in battle.c, `g_mItemShelterGate`,
   `mSavePromptOn` in menu.c, `g_owSuspendNmis` in world.c, `g_gwarp`, `g_stagePic` in field.c). Group (c)
   is the work: probably a few dozen variables per subsystem, found by classifying each static once.
5. **Heap**: ~41 allocations in field.c (picture buffers, masks, the per-scene `CtScene`), ~54 in scene.c
   (decoded scene data), a few in audio and battle. Mostly derived from the asset pack; the `CtScene` and
   `World` structs hold pointers into it (`raw`, `body`, the zero-copy sprite atlases), which a restore must
   keep from the live process, as `CtSceneLoadState` already does.

Main structs are mostly flat: `CtBattleHost` (`battle.h` 177-857) has only four pointers (mem, glb, a
callback, ctx); `World` (`field.c` 315-356) has its views, asset pointers and 8 KB of object snapshots.

## 3. Approaches

### a. RotP-style: one arena, dump the arena

zelda3 snapshots anywhere because its port was built with all state in one SNES-shaped block (WRAM,
SRAM, PPU, DMA, APU; RotP `zelda_rtl.c` InternalSaveLoad ~965). Belthasar half-matches: the WRAM spine is
there, but it renders natively (no PPU block to dump) and keeps its mode machine in `main()`'s locals and
several hundred statics. Moving all of that into one arena means rewriting `main()` and touching hundreds
of statics across a 100k-line upstream that changes daily. Most robust result, highest effort, and the
largest diff to carry against the pin.

### b. Whole WASM linear memory snapshot

Rejected. The reasons, in order:
- **JSPI**: `main()` is suspended inside `CtPresentSwap -> ck_yield_to_host` (`ck_loop.c`) on a JSPI stack,
  and the sound coroutine on a second one (`coro_wasm.c`). Wasm locals of suspended frames live in the
  engine's stack, not in linear memory; only address-taken locals sit on the shadow stack. Restoring the
  memory under a live suspended stack would roll back the heap and statics while `main()`'s register locals
  (`battlePhase`, `px`, ...) keep the current values: an inconsistent machine. Only Asyncify writes the
  stack into memory, and the build chose JSPI because Asyncify cannot sit beside the coroutine (and costs a
  lot of size and speed on this code base).
- **Size**: `INITIAL_MEMORY` is 256 MB (growth to 1 GB). A rolling auto-save of that, even compressed, is
  slow and heavy; RotP's states are about 300 KB.
- **Compatibility**: valid only for the byte-identical core build. Every ChronoKi or Belthasar change
  orphans every state, where RotP's survive rebuilds.
- **JS glue**: MEMFS (the asset pack, `/saves`), `Module.ckCoros`, the pending wake promise, the audio
  queue, the clock all sit outside linear memory and would need their own capture.
- **Game data**: the linear memory holds the ROM image and the decoded asset pack, so every state file
  would carry copyrighted game data. That breaks the project's first rule the moment a state is shared.
- **Native builds** (Belthasar.exe, Android) get nothing from it.

### c. Per-subsystem serialisers

Extend what the field already does to battle, menus, overworld and cutscenes. Effort moderate per
subsystem and it lands in pieces. The weakness is today's format: a raw `memcpy` of `CtScene` refuses on
any layout change, and there is no single moment the whole host is consistent (F5 runs mid-frame in the
field path only).

### Recommendation: c, built around a's spine ("WRAM core + tagged sections at one safe point")

- **One safe point**: the save or load request is serviced at the top of the main loop (~11391), where only
  `main()`'s frame is live and the sound machine is between frames. No fake keys, no mid-frame snapshots.
- **The core block** (RotP's InternalSaveLoad, Belthasar's version): WRAM 128 KB + SRAM 8 KB + the sound
  machine state. Fixed layout, valid across every build.
- **Tagged sections**, each with its own id, version and length: `host` (the mode machine hoisted out of
  `main()`), `scene`, `world`, `battle`, `menu`, `seq` (title, cutscenes, gate warp, race, ending).
  A state carries the core block plus the sections of the active mode.
- **Fields written by name, not struct `memcpy`**: each section writes an explicit list (an X-macro table
  of field, offset, size per struct), so adding a field to a struct does not move the format; an unknown
  section version is refused cleanly, a missing new field takes its default.
- **Load rebuilds, then overlays**: load enters the saved mode the way the game itself does (location load
  from the WRAM image, `CtSceneSeedFromWram`, `fieldMapFromWram`, world entry, the menu's and battle's own
  boot from a WRAM image, which `--menutest` / `--battletest` / `--loadwram` already prove), rebuilds
  caches from WRAM and the asset pack, then writes the dynamic section fields over it. Pointers are never
  saved.
- **No game data in a state** beyond what an SNES state also holds (the WRAM): asset-derived buffers are
  rebuilt, never written.

Why not a alone: it is the end state of this plan in effect (WRAM spine, everything else explicit), but
reached subsystem by subsystem instead of one big rewrite of `main()`. Why not b: section 3b.

## 4. Where the engine changes go (blocker for every phase)

`core/belthasar` is a git-ignored import of upstream at a pinned tag; ChronoKi only adds exact-match text
patches at build time (`core/wasm-build/shapes.mjs`, one line in `datapack.c`). A patch set that hoists
`main()`'s state and adds serialisers to battle.c, menu.c, world.c would break on most re-pins. Two ways:
- **Upstream it** (recommended): offer the work to BelthasarProject as PRs. Its F5/F9 is upstream's own
  debug feature, the gain is theirs too (native and Android builds), and ChronoKi keeps vendoring
  unchanged code. Needs public contact and pushes, so it is the owner's call.
- **Fork**: ChronoKi carries the changes on its own branch of Belthasar and rebases on each re-pin
  (`docs/port-approach.md` already lists "track or fork" as the open risk).
Until that is settled, phase 0 can land as a small patch set (the loop-top hook, the exports), and the
classification work (which statics and locals are state) is valid either way.

## 5. Phases (each lands on its own)

**Phase 0: plumbing and stamp** (no new coverage; replaces the fake keyboard)
- Exports `CkStateSave()` / `CkStateLoad(ptr, len)` / `CkStateBuffer()` (bytes in linear memory, no
  MEMFS files); a request flag serviced by a one-line hook at the loop top in `field.c`.
- `sdl_events.c`: drop the F5/F9 emulation; `ck_state_available()` asks the engine
  (`CtStateSafeNow()`), which answers per mode: true where a section exists, false during unsupported
  windows. A request in an unsupported window is held and serviced at the next safe frame (bounded: give up
  after N frames, report "not now").
- `CKST` v2 container: core block, sections, and a stamp section: Belthasar pin commit, ChronoKi core
  version, a schema hash generated at build time from the section tables, the mode tag. App side: port
  RotP's `state-stamp` (stamp at the storage boundary, `stampAtCapture`, layout drift reported once per
  session) and its `checkLoadable` refusal with a readable reason. v1 states (field only) keep loading
  through a v1 reader while it is cheap to keep.
- Files: `core/reconnect/sdl_events.c`, `core/wasm-build/ck_api.c`, `build.mjs` (exports), `field.c` (hook),
  `packages/game-core/src/port/state-container/*`, `apps/desktop/src/game/save-states/*`, a new
  `state-stamp/`.

**Phase 1: the host mode machine** (`host` section)
- Classify `main()`'s pre-loop locals into config / per-frame scratch / persistent; move the persistent ones
  (estimate 80 to 150 scalars plus a few structs) into one `CtHostState` struct, accessed as `hs->`.
  Mechanical but wide; the biggest single diff. Write its field table.
- Re-express the field scene section over the new format: `CtScene` written by field table, player
  position in `host`. Cross-scene load becomes "enter the location from the WRAM image, then overlay",
  not the F9 door walk.

**Phase 2: overworld** (`world` section)
- `World wd`'s dynamic fields (camera, mover, stream, shown OAM, flags), not the asset pointers or the
  pristine snapshots (re-derived at world entry); world.c's group (c) statics.
- Load: the existing world entry from WRAM (`--loadwram`'s path), then overlay.

**Phase 3: menus** (`menu` section)
- menuPhase/menuScreen/cursor state, `CtMenuShop`, repeaters, menu.c's group (c) statics. The field or
  world picture frozen behind the menu (`menuFrozen`, `menuStash`) is re-rendered from the restored
  underlying mode rather than stored (keeps game pixels out of the file); if a re-render is not exact,
  store it compressed and say so in a decision.

**Phase 4: battle** (`battle` section)
- `CtBattleHost liveHost` by field table (skip mem/glb/frame/ctx), battle.c's group (c) statics (death scan,
  NMI line, sound sink state, FX rows if not derivable), the field state underneath (the battle returns to
  it). Load: the battle's own boot from a WRAM image, then overlay. Largest risk of hidden state; see 7.

**Phase 5: cutscenes and transitions** (`seq` section, or declared windows)
- Title intro, seq_entry*/seq_ending/race/gate warp, door and world fades (`pendKind`, `fade`). Each one
  either gets a small section or stays a declared unsafe window where the request waits for its end.
  Decide per sequence by length: a few frames wait, a long cutscene gets a section.

Order: 0 first; 1 before the rest (everything needs `host`); 2, 3, 4 in any order, independent coders in
sequence because they all touch `field.c` (memory note: parallel edits of one file conflict).

## 6. Testing (no ROM in CI; all ROM runs local and hidden)

- **Round trip per mode**, headless: the game module runs in Node (`-sENVIRONMENT` includes node). Script
  input with `CkSetInput` into each mode (field walk, overworld, open menu, enter a battle through an
  encounter or `--battletest`'s WRAM seed, a cutscene). At frame N save; run M frames recording a per-frame
  hash of WRAM, the framebuffer and the audio output; load; replay the same M frames of input; compare
  every frame. Pass = identical hashes. Extends upstream's `CT_STATEROUNDTRIP` (save, poison, load,
  compare) and `CT_DEBUG_KEYS` ideas to every mode.
- **Cross-mode load**: save in battle, load from the field and from the overworld, and the reverse.
- **Rebuild tolerance**: a state saved by build A loads in build B when only code changed; a schema change
  is refused with the stamp's reason, never half-loaded.
- **App**: quick slot, named slot, auto-save rotation, thumbnail, load-while-booting, refusal message;
  through the project's hidden launch, one launcher agent.
- Fixtures: states are made from the player's ROM at test time and live in git-ignored folders only.

## 7. Risks

- **Hidden state** (the main risk): a static or local that matters and was classed as scratch shows up
  only as a divergence frames later (a sound, a timer, an RNG byte, an animation phase). The per-frame
  compare is what catches it; every subsystem needs its own scripted scenario, battle most of all.
- **Upstream churn**: the pin moves daily; patches against 10k-line `main()` rot fast unless upstreamed.
- **Rebuild-from-WRAM is not exact** for some mode (mid-animation, a menu's open transition); then that
  state goes into its section explicitly, at the cost of more fields.
- **Sound replay cost**: the machine replays inputs since its last restore point on load; check the
  worst-case load time stays under a frame or two.
- **Field ordering inside a frame**: the loop-top point must be after the previous frame's present and
  before the next frame's input read; the interpolation loop in `hostPresentMot` presents several times
  per frame and must not be a save point.

## 8. Open question for the owner

Do the engine changes go upstream to BelthasarProject as PRs (public contact under ChronoKi's name,
which is not collision-checked yet), or does ChronoKi carry a fork of Belthasar? Recommended: upstream.
Until answered, phase 0 lands as a small patch set and phase 1 starts on a local branch of the import.
