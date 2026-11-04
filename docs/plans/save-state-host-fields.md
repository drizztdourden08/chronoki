# Save states, phase 1: the host section

Part of [save-state-anywhere-plan.md](save-state-anywhere-plan.md). Phase 1 moves the host mode machine into the state:
the locals `main()` in `field.c` declares before its main loop.

## Approach

`main()` declares 385 locals before `while (running && !g_shotsExit) {`. We did not rename the persistent ones to
`hs->name` across the 10,000-line function. That would be a wide transform on a file upstream changes daily, and a
nested local with the same name would make it silently wrong. The locals stay as they are. Two exact patches
(`core/wasm-build/state-patches.mjs`) add the rest:

- `#include "ck_host_state.h"` before `main()`. This brings in the `CtHostState` struct and its field table
  `ckHostFields` (name, offset, size). Both are generated from the X-macro list `core/reconnect/ck_host_fields.h`.
- `#include "ck_host_point.inc"` as the first statement of the loop body. This is the safe point: it is between frames,
  and every pre-loop local is in scope there. It does the following:
  - asks `ck_state_top` which mode the loop is in;
  - on a save, copies every listed local into one `CtHostState`;
  - on a load, copies the restored struct back into the locals.

Three guards keep the list exact:

- **Build-time set check** (`core/wasm-build/host-fields.mjs`). `main-locals.mjs` parses `main()`'s pre-loop
  declarations. Every declared local must be either a host field or in the excluded table with its class, and every name
  on either list must still be declared. A new, renamed or removed local fails the build and names the local.
- **Compile-time type check.** `ck_host_point.inc` has one `_Static_assert` per field
  (`__builtin_types_compatible_p(__typeof__(local), type dims)`), so a type change upstream fails the compile.
- **Schema hash.** The field list (name, type, size expression) is part of the stamp's schema hash
  (`state-stamp.mjs`). The core version is now 0.2.0.

## The container (CKST v2)

The sections, in order:

1. STMP: the stamp.
2. CORE: 128 KB of WRAM, then 8 KB of SRAM.
3. SCEN: the engine's scene state. Field saves only.
4. HOST: the new section.
5. APU: the sound machine state.

HOST is written field by field, never as one struct copy. Each record is a u8 name length, the name, a u32 size, then the
bytes. On load, a record is copied only when a field has the same name and size, so struct padding never reaches the
file.

HOST holds 278 fields. The largest parts are:

- the player: `px py pz pfac`, plus animation and idle state;
- `scene`, `frameNo`, `inWorld` and the flag buffer;
- the menu machine, including its shop, save, tech, item and equip pages and the `menuSaveShowSram` copy;
- the text box, choice and naming machine;
- fades, the gate warp counter, and cutscene, title, race and ending sequencing;
- overworld timers and the map stash;
- pending transitions;
- load-transition counters.

Player position lives here, not in a separate record. A state with no HOST section falls back to the scene state's
player record.

## Load

There are two cases:

- **Same scene.** Load runs `CtSceneLoadState`, then `fieldMapFromWram`, then the audio load, then unpacks HOST.
- **Different scene, or a field load started from the overworld.** No F9 door walk and no fade. Load:
  1. copies the state's CORE WRAM into the live WRAM;
  2. frees the field;
  3. runs `fieldLoad` on the saved location, with the door-commit entry steps (camera entry, door list, palette and text,
     chest pre-bump, entry tilemap, pass-object slots, arrival tile mode);
  4. then does everything the same-scene path does.

  If `fieldLoad` fails, the load reports failure. A field load reloads the old scene; if that also fails, the loop stops.
  A load started from the overworld stays in the overworld.

The old F5 / F9 debug-key path is switched off, along with its `[debug] F5: saved ...` print. Saves and loads happen only
at the safe point. The audio restore is unchanged. Overworld states are still saved and still refused on load (phase 2).
The refusal reasons are unchanged: not a state, corrupt, schema, mode, not now.

## Known gaps

- **Text box pointer.** `tbStr` is not saved. If the restored text index or table differs from the live one, the box is
  refetched. A save made while a box is still revealing restarts that box from its beginning.
- **Static state in other files.** Statics inside `field.c` functions and in `ct_vm.c`, `menu.c`, `battle.c` and
  `world.c` are still not saved, as in phase 0.
- **Later phases:**
  - the overworld struct `wd` and its statics, phase 2;
  - battle (`liveHost`), phase 4;
  - the gate-warp pointer `gwN` and the sequence and race windows, phase 5.
- **SRAM.** SRAM is saved in CORE but not restored on load, as in phase 0.
- **Size.** The host list is larger than the plan's estimate of 80 to 150, because inclusion was conservative. Anything
  read across frames is saved, including state that is idle at a field save point.

## Classification

The classes:

- **host:** saved in HOST.
- **config:** set once per session.
- **pointer:** an address. It means nothing in another session.
- **resource:** an engine object rebuilt from data.
- **harness:** test, shot or debug bookkeeping, or loop control.
- **scratch:** rewritten before every use.

| name | type | class | why |
|---|---|---|---|
| macStatus | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| androidStatus | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| datpath | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| shot | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| flagsPath | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| sprTest | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| descTest | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| walkScript | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| playScript | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| scene | `int` | host | mode machine state read across frames |
| selftest | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| talkObj | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| gotoExit | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| tframes | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| targetPage | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| chooseSel | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| doSelect | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| atX | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| atY | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| showPrio | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| worldTest | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| walkDir | `char` | config | set once from the command line, the build or boot; the same for every state of a session |
| reenterDest | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| newGame | `int` | host | mode machine state read across frames |
| sceneSet | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| bootNatural | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| loadWramPath | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| loadStatePath | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| battleTest | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| menuTest | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| btWramPath | `const char*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| btWram | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| gmem | `uint8_t [0x200]` | config | set once from the command line, the build or boot; the same for every state of a session |
| haveFlags | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| vehicleFrameBase | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| assets | `CtAssets` | resource | the loaded data set: same for every state of a build |
| fontLen | `uint32_t` | config | set once from the command line, the build or boot; the same for every state of a session |
| font | `const uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| f | `Field` | resource | the Field (scene VM, maps, sprites): rebuilt by fieldLoad and fieldMapFromWram, its VM by CtSceneLoadState |
| pfacInit | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| px | `double` | host | player position, facing and animation, read every frame |
| py | `double` | host | player position, facing and animation, read every frame |
| pz | `int` | host | player position, facing and animation, read every frame |
| pfac | `int` | host | player position, facing and animation, read every frame |
| prevF5 | `int` | harness | debug-key edge memory; F5 / F9 are switched off |
| prevF9 | `int` | harness | debug-key edge memory; F5 / F9 are switched off |
| camSeeded | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| stateRestored | `int` | config | boot-time flag for the --state switch |
| wd | `World` | resource | the overworld struct: phase 2 (world section) |
| worldBlobLen | `uint32_t` | config | set once from the command line, the build or boot; the same for every state of a session |
| haveWorld | `int` | resource | tied to wd: phase 2 |
| inWorld | `int` | host | mode machine state read across frames |
| worldTick | `int` | host | mode machine state read across frames |
| wtStage | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| flagsBuf | `uint8_t [0x200]` | host | mode machine state read across frames |
| haveFlagsBuf | `int` | host | mode machine state read across frames |
| audioOn | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| audioDev | `SDL_AudioDeviceID` | resource | the audio device handle |
| audioHz | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| audioSamplesPerFrame | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| audioBuf | `int16_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| audio | `CtAudio*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| wramSeeded | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| seedSpc | `Snes*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| ruleSpc | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| ruleSeeded | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| powerOn | `int` | config | boot-time power-on choice; powerOnLoad (the live one) is saved |
| pc | `CtPresentConfig` | resource | the CPU core for battle and menus, rebuilt when they open |
| pr | `CtPresenter*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| win | `SDL_Window*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| fb | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| sidx | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| spal | `uint8_t [48]` | scratch | scratch palette rewritten before every use |
| front | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| pmask | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| animPlay | `AnimPlay [64]` | host | player position, facing and animation, read every frame |
| sidePlay | `static AnimPlay [64]` | host | player position, facing and animation, read every frame |
| sideShown | `static uint8_t [64]` | host | player position, facing and animation, read every frame |
| pPlay | `AnimPlay` | host | player position, facing and animation, read every frame |
| pIdleCtr | `int` | host | player position, facing and animation, read every frame |
| pBlink | `int` | host | player position, facing and animation, read every frame |
| pAnimMode | `int` | host | player position, facing and animation, read every frame |
| pLastAf | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| pLeadHold | `int` | host | player position, facing and animation, read every frame |
| pLeadShown | `int` | host | player position, facing and animation, read every frame |
| pLeadHoldAf | `int` | host | player position, facing and animation, read every frame |
| pRng | `unsigned` | host | player position, facing and animation, read every frame |
| owExitWait | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owExitOff | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owEnterCd | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| running | `int` | harness | the loop flag; a load must not copy a stale value over it |
| frameNo | `int` | host | mode machine state read across frames |
| gameOver | `int` | host | mode machine state read across frames |
| goPhase | `int` | host | mode machine state read across frames |
| goBri | `int` | host | mode machine state read across frames |
| battlePhase | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| liveHost | `CtBattleHost` | resource | the battle host, holds pointers: phase 4 |
| battleReturnHold | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| battleReturnWait | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| fieldIrqPreFlip | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| battleExitPoll | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| battleBootPostAt | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| battleTailLeft | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| coldResetHold | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| coldResetCyc | `long` | host | battle hand-off timers and edges (zero at a field save point) |
| coldResetWall | `long` | host | battle hand-off timers and edges (zero at a field save point) |
| battleInidisp | `uint8_t` | host | battle hand-off timers and edges (zero at a field save point) |
| prevBattleA | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| prevBattleU | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| prevBattleD | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| prevBattleL | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| prevBattleR | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| prevBattleB | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| battleAReleased | `int` | host | battle hand-off timers and edges (zero at a field save point) |
| menuPhase | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuT | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| prevXBtn | `int` | host | mode machine state read across frames |
| prevBBtn | `int` | host | mode machine state read across frames |
| menuShellF | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuShellP | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuBri | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuBriPic | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuReloadW | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuReloadT | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuFadeLive | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuShellS0 | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuFrozen | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| menuStash | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| menuStashOw | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuOwStashT | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuPrevDx | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| menuPrevDy | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| menuOpt | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| prevLBtn | `int` | host | mode machine state read across frames |
| prevRBtn | `int` | host | mode machine state read across frames |
| prevABtn | `int` | host | mode machine state read across frames |
| menuEnterPending | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEnterFirst | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuOptShown | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuRibbonWait | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuScreen | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuShop | `static CtMenuShop` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuShopOn | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSavePtOn | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuExchOn | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuExch68 | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuExchSong | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuExchOld | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuExchHold | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| prevYBtn | `int` | host | mode machine state read across frames |
| menuExchWaveP | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuNameOn | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuName68 | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuNameOut | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuNameId | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuLoaderOn | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| ldrRebootPend | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuStat0412 | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuStatDimSlot | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuStatSub | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuStatSlot | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuStatChar | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqListRise | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqListFall | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqRowsHold | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqListFresh | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEquipSlot | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqSlide | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqExit | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqKey | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqA45D | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqLRYield | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqSlideStep | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqSlideO | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqPrevId | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemSlideStep | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemSlideO | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechListRan | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuMemSlide | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuMemDir | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSbTask | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| prevUBtn | `int` | host | mode machine state read across frames |
| prevDBtn | `int` | host | mode machine state read across frames |
| menuSaveDoWrite | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSaveShowSram | `static uint8_t [0x2000]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSaveRowsHold | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSavePanelHold | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSavePromptHold | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSavePromptShown | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSavePrompt | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuRepU | `CtMenuRepeat` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuRepD | `CtMenuRepeat` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuRepL | `CtMenuRepeat` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuRepR | `CtMenuRepeat` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechTab | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechRow | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechScroll | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechTgt | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechPre | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechOvBuild | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechOvFirst | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechRet | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechShown | `uint16_t [3][2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechShownMp | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechPopCurve | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechPopPool | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechPopAmt | `int [3][2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuRngCur | `unsigned` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqCand | `uint8_t [0xF2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqCnt | `uint8_t [0xF2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqShowCand | `uint8_t [0xF2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqShowCnt | `uint8_t [0xF2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqShowCount | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqCount | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqCell | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuEqScroll | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuCfgCur | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuCfgSub | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSaveCur | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuSaveHoverPanel | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| ldrCur | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| ldrPrevDir | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| ldrDone | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| seqSeen | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| ldrPendSlot | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| ldrFadeF | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| noPcVisit | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| noPcShot | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| ldrShot | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| titleIntro | `static CtTitleIntro` | host | cutscene, title, race, ending or gate-warp sequencing |
| introShot | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| seqFadeAt | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| seqBri0 | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| seqShot | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| seqOpen | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| seqOpenFrame | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| raceOn | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| raceEnded | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| endOn | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| endEnded | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| gwN | `CtGwarp*` | pointer | gate-warp pointer, phase 5 (gwNState, the counter, is saved) |
| gwNState | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| seqHold | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| menuFormSlot | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuFormPick | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| mtSprSeq | `uint8_t [CT_MSPRSEQ_N]` | harness | sized by CT_MSPRSEQ_N, a define inside main(); a menu-test buffer |
| mtSprChar | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| menuItemRow | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemScroll | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemLabel | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemPicked | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemTgt | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemInfo | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemSub | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemSubSeen | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuTechFresh | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuWinColour | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuWinDim | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuCfgFresh | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemOrg | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemShowBag | `static uint8_t [0x200]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemTgtBuild | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemShown | `uint16_t [3][2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemPopCurve | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemPopPool | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemPopBits | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemPopAmt | `int [3][2]` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemB31C | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemTabX | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemAllTask | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuNavHandOk | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemPopPal | `long` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemPinTask | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuFormPickTask | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuFormAnimReq | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuItemAAFF | `int` | host | menu machine state (stays valid when a load lands in the field: the menu is closed there) |
| menuFb | `uint8_t*` | pointer | a pointer or buffer address: meaningless in another session; what it points at is rebuilt or saved elsewhere |
| mtPre | `MtSnap` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtPost | `MtSnap` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtNp | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtDataOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtResumeOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtFnv | `uint32_t` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtItemOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtStatusOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtTechOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtConfigOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtFormOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtSaveOk | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| mtHp | `int [4]` | harness | test-harness, shot or debug bookkeeping, or loop control |
| btBattleFrame | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| battleResolved | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| battleResolveFrame | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| ngIntro | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| ngIntroT | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| ngIntroDone | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| FADE_STEP | `const int` | config | a constant |
| fade | `int` | host | mode machine state read across frames |
| fadeBri | `int` | host | mode machine state read across frames |
| gwPhase | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| gwCtr | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| gwOp | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| gwLoop | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| ffPro | `int` | host | cutscene, title, race, ending or gate-warp sequencing |
| GW_SETUP | `const int` | config | a constant |
| loadFadeF0 | `int` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| loadRamp | `int` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| loadRampSkip | `int` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| owVehicleModule | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owEventModule | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owGaugePh | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owGaugeT | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owGaugeN | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owGaugeEarly | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owMapPh | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owMapT | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owMapEarly | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owMapStash | `static uint8_t [0xF0 + 0x1000]` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owPassHold | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| owPassResume | `int` | host | overworld timers and stashes: kept so the field and world modes stay in step |
| entrySweepPend | `int` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| loadPostTotal | `long` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| loadWalk | `CtLoadCost` | resource | holds a pointer; lives only during a load transition, which is never a save point |
| loadWalkCyc | `long` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| load9dc3 | `long` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| loadW | `long` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| loadW0 | `int` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| loadHold | `int` | host | load-transition counters (idle at a save point, saved so a load clears a live one) |
| pendKind | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendWorld | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendDest | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendFac | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendHasFlags | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendStateLoc | `int` | harness | the old F9 door-walk continuation, no longer used |
| pendX | `double` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendY | `double` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendTileX | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendTileY | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendWX | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendWY | `int` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| pendFlags | `uint8_t [0x200]` | host | a pending transition (zero at a save point, saved so a load clears a live one) |
| selftestFrames | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| tbStr | `const char*` | pointer | points into the text table; refetched from tbLastIdx / tbLastTbl after a load |
| tbStrLen | `int` | resource | travels with tbStr (refetched with it) |
| tbPage | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbReveal | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbN | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbLastIdx | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbLastTbl | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbPageStart | `int [40]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbNL | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbLine | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbTop | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbAdv | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| lastCamY | `int` | host | mode machine state read across frames |
| tbAnim | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbPageFollowed | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbSlotPos | `int [4]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbSlotN | `int [4]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbBufPos | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbBufN | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbLineStepDue | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbBreakAt | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbPausePos | `int [TB_MAXPAUSE]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbPauseArg | `int [TB_MAXPAUSE]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbNPause | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbPauseNext | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbAutoEnd | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbClose | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbWasActive | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbWasChoice | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbLS | `int [160]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| tbLB | `uint8_t [160]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| choiceSel | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| didSelect | `int` | harness | test-harness, shot or debug bookkeeping, or loop control |
| nmLastId | `int` | config | set once from the command line, the build or boot; the same for every state of a session |
| nmRow | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| nmCol | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| nmPos | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| nmBuf | `char [8]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| nmCt | `uint8_t [6]` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| nmMsgShow | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| atbSelRow | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| atbTypeStep | `int` | host | text box, choice and naming state: a save mid-dialogue resumes the box |
| powerOnLoad | `int` | host | mode machine state read across frames |
