# Aspect ratio parity with RotP (I-74): plan

Design only. The owner's ask: aspect ratio "exactly like RotP: wide and tall with custom". Engine line numbers are
against the current pin (BelthasarProject v0.13.0-preview, `core/belthasar.pin.json`). RotP paths are under
`X:/relic-of-the-past/apps/desktop/src` (app) and `packages/` (packages).

## 1. RotP's model

| Part | RotP |
|---|---|
| Main choice | `original`, `auto`, `screen`, `wide`, `tall` (only with Tall Rendering), `custom` (`display/aspect-choices.ts`) |
| Wide presets | 4:3, 16:9, 16:10, plus 21:9 with Linear World Tilemap, plus 32:9 with Ultrawide |
| Tall presets | 4:5, 3:4 (`display/display.constants.ts` `TALL_PRESETS`) |
| Stored value | `aspectRatio: 'original' \| 'auto' \| 'screen' \| '4:3' \| '3:2' \| '16:9' \| '16:10' \| '21:9' \| '32:9' \| '4:5' \| '3:4' \| 'custom'`, `customAspectW`, `customAspectH` (integers; 0 = unset, falls back to the detected screen) (`features/src/settings/aspect-settings.type.ts`) |
| Custom entry | two `NumberInput`s `w : h` (`RatioPairFields`); committed only when `validateCustomRatio` passes; first pick of Custom seeds the pair from `detectScreenRatio` (`behavior/ratio-change-for.ts`) |
| Limits | `MIN_ASPECT = 256/480` (0.53, the 128-row top/bottom budget), `MAX_ASPECT = 1024/240` (4.27, 384 columns a side) (`game-core/src/aspect-ratio/aspect-ratio.constants.ts`); errors "Too tall" / "Too wide" |
| Auto / Screen | window / physical screen ratio, landscape-normalised, clamped; readout "Detected" and "Calculated (capped by the engine limit)" |
| Shape sent to core | `ratioToString(allowedRatio(s), renderHeight(s))` into the ini `ExtendedAspectRatio`; Original = 256 wide, 224 or 240 lines (Extend Y); every other choice 240 lines; tall = extra rows above and below (`ratio-capability/*`, `settings/serialize-to-ini.ts`) |
| Gate chain | `extendedRendering` -> `linearWorldTilemap` -> {`ultrawideRendering`, `tallRendering`}; `aspectRatio`, `extendY`, sprite and fix toggles need `extendedRendering`; `extendY` only with Original; `widescreenSprites` / `widescreenPlayArea` only when the view really renders wide (`display/is-display-disabled.ts`) |
| Cascade | Linear off: 21:9 or 32:9 -> 16:9, Ultrawide and Tall off; Ultrawide off: 32:9 -> 21:9; Tall off: tall ratio -> 4:3 (`display/with-aspect-cascade.ts`) |
| Vanilla Safe | every id is `affectsVanillaParity`; the resolver strips them and the `requires` fixpoint collapses the chain; the picker shows "Turn on Extended Rendering to pick a ratio other than 4:3" |
| Gameplay options | `widescreenSprites`, `widescreenPlayArea`, `offscreenAI` (idle / vanilla / paused): RotP's wide view changes what the game simulates |

## 2. ChronoKi today and the gap

| Part | ChronoKi | Gap |
|---|---|---|
| Master gate | feature `widescreen`, label "Extended Rendering" (`packages/features/src/feature-registry/core-features.constants.ts:5`) | same role; keep the id |
| Ratio | option `widescreenAspect: '16:9' \| '16:10' \| '21:9'` (`packages/features/src/gate-options/gate-options.type.ts`, `apps/desktop/src/screens/game/video/picture.settings.ts:12`) | no Original, Auto, Screen, 4:3, Tall, Custom |
| To the core | `gateSettings` -> ini `[video] widescreen=16:9` (`packages/game-core/src/port/gate-settings.ts:13`); width formula duplicated in `frame-size/frame-size.constants.ts:6` and the engine's `hostWideW` | three fixed values; two copies of the formula |
| Frame | `frameSizeOf`: width = ratio x 224, even, 256..544; always 224 lines (`frame-size/frame-size-of.ts`) | no tall box |
| Window | `useAspectRatioLock` / `usePixelPerfectSize` take `frameSizeOf` (`views/GameLayer/GameLayer.tsx:26-27`) | need the presented box, not only the core frame |
| Fixes | `sceneAdjust` (Widescreen Fixes), `wideSteamMargins` (Steam art), `fillBottomLine` (211 -> 224 lines) | `fillBottomLine` is ChronoKi's Extend Y |
| Gameplay options | none needed: Belthasar's wide view is picture-only, "The ROM's camera is untouched" (`field.c:4492`) | RotP's sprite / play area / off-screen AI rows have no counterpart and are not ported |

## 3. Engine findings

**Wide.** Every width goes through one function, `hostWideW` (`core/belthasar/src/field.c:2498-2505`): a table of
three ratios indexed by `st->widescreen`, times `CAMH` 224, even, clamped to `FIELD_WMAX` = `CT_MOT_W` = **544**
(`motion.h:18`, `field.c:2478`). The ini parser is ChronoKi's own (`core/reconnect/settings_reconnect.c:43-44`).
Max ratio today: 544/224 = **2.43:1** (21:9 = 522 px fits; 32:9 = 796 px does not). Any ratio from 8:7 to 2.43
is a one-line change: replace the table read with a host width (one exact-match entry in `FIELD_PATCHES`,
`core/wasm-build/state-patches.mjs:24`, which already patches `field.c`).

**Tall.** Not possible without a fork-sized patch. 224 lines are fixed across the engine:

| Mode | Wide today | Tall: what blocks it (evidence) |
|---|---|---|
| Field | yes: compositor draws `g_fw` wide, view held at the room edge or the Steam margins (`field.c:2474-2481`, `17877-17880`, `4498-4512`) | `CAMH 224` (`field.c:106`), every picture buffer `FIELD_WMAX * CAMH` (`field.c:2480-2496`); 342 `CAMH`/224 sites in `field.c`; the SNES shows 211 lines and the row past a room's bottom is the next room or the map wrapping (`field.c:17850-17857`); objects the ROM culls have no OAM entry above or below its window |
| Overworld | yes: picture-only tilemap, ghosts for objects in the sides (`field.c:13051`, `384`, `OW_WMAX 544` at `1521`) | `owSubScr[OW_WMAX * CAMH]` (`field.c:1538`); no vertical ghosts |
| Battle | yes: arena sides around the 256 view, HUD band sides (`battle.c:17842`, `18033`; `field.c:18755`) | HUD strip is the bottom band of the 224 picture; arena is the field picture at the fight's camera |
| Menus | pillarboxed at 256 (`field.c:2506-2516`, used at `2545`) | none needed: letterbox |
| Cutscenes (PPU-translated stages) | yes: side columns per line (`seq_pic.c:381`) | lines `1..224` only (`seq_pic.c:381`, `snes/ppu.c:298`); PPU buffer 239 lines max (`snes/ppu.h:129`); OAM Y is 8-bit, games park sprites at Y 224+ |
| Title intro | yes: mode 7 drawn wide (`field.c:2535-2541`) | renders 224 rows |
| Interpolation / render scale | frames carry their own width (`motion.c:10`) | `CT_MOT_H 224` sizes every motion frame (`motion.h:19, 39, 43`) |

Cost of true tall: every `CAMH` site in `field.c`, `main.c` (39), `battle.c`, `seq_pic.c`, `title_intro.c`, `motion.*`,
`fieldnative.*`, plus a vertical room clamp, vertical object ghosts and battle HUD placement. As exact-match patches
that is a private fork broken by every pin bump: **XL, not recommended**. Ask upstream instead.

**Honest fallback for tall:** the core keeps drawing 256 x 224; the app presents it centred in a box of the chosen
tall ratio with black bars top and bottom, and the UI says so ("Letterboxed: the engine draws 224 lines"). Ratios
below 8:7 (1.14) take this path; the readout says "letterboxed" the way RotP says "capped".

Cost of ultrawide past 2.43 (not planned): raise `CT_MOT_W`, `OW_WMAX` (3 define patches), but sprites fold at the
9-bit OAM X (`field.c:1312`, `8489`, `8509`) and PPU-drawn sides wrap the 512 px tilemap; **M-L**.

## 4. Target settings

| Key | Shape | Default | Gate |
|---|---|---|---|
| `widescreen` (gate id kept; label "Extended Rendering") | in `gates` | off | master; `affectsVanillaParity` |
| `tallRendering` (new gate, label "Tall (letterboxed)") | in `gates` | off | requires `widescreen`; `affectsVanillaParity`, `live: false`, origin `chronoki` |
| `aspectRatio` (gate option, replaces `widescreenAspect`) | `'original' \| 'auto' \| 'screen' \| '4:3' \| '16:10' \| '16:9' \| '21:9' \| '4:5' \| '3:4' \| 'custom'` | `'16:9'` | option of `widescreen` (`OPTION_KEY_FEATURE`) |
| `customAspectW`, `customAspectH` | integers, 0 = unset (seed from screen) | 0, 0 | option of `widescreen` |
| `sceneAdjust`, `wideSteamMargins`, `fillBottomLine` | unchanged | unchanged | unchanged |

- Presets: Wide 4:3, 16:10, 16:9, 21:9 (all fit 544). No 32:9, no Linear / Ultrawide toggles (the engine has no
  512 px wrap below 544). Tall 4:5, 3:4 only with `tallRendering`. Original = 256 x 224; `fillBottomLine` stays its
  own row, the counterpart of RotP's Extend Y.
- Limits: `MIN = 256/480` (RotP's, so Custom accepts the same tall range, all letterboxed below 8:7);
  `MAX = 544/224`. Width = `clamp(even(round(r x 224)), 256, 544)`; 4:3 -> 298, 16:10 -> 358, 16:9 -> 398, 21:9 -> 522.
- Auto and Screen resolve when the core starts (the option is not live, like every video option today).
- Cascade: `tallRendering` off with a tall ratio -> `'4:3'`; `widescreen` off keeps the value but the core gets 256.
- Vanilla Safe: the resolver strips `widescreen`, the `requires` fixpoint drops `tallRendering`, `gateSettings`
  sends width 256, the picker shows the lock message. Every non-original choice is behind `widescreen`.
- Core contract: game-core computes one `{ wideWidth, frame, presentBox }` from the settings; the ini keeps a
  non-off `widescreen=` (so `st->widescreen` stays on) plus a new ChronoKi key `wide_width=<px>`; `settings_reconnect.c` stores it in
  a reconnect global; the `hostWideW` patch returns it when set. `frameSizeOf` and the ini read the same number.
- Migration (`normaliseSettings`, and profiles on load): `widescreenAspect` X -> `aspectRatio` X (all three values
  exist), `customAspectW/H` 0, drop the old key. Gate ids unchanged, so stored `gates` and profile presets need nothing.

## 5. Phases and coder batches

| Phase | Work | Acceptance |
|---|---|---|
| P0 Brock | Move RotP's `AspectRatioControl` (header, pair fields, `useRatioPair`, `ratioChangeFor`, `mainValueOf`) and the pure ratio math (detect, clamp, validate, nice ratio, readouts) into the `brock-display` module, with `limits {min, max}`, preset groups and setting keys as props instead of RotP types | control renders RotP's groups from props; RotP's aspect unit tests pass against it; published |
| P1 Core | `wide_width` ini key, reconnect parse, `hostWideW` exact-match patch; game-core `port/aspect/` (ratio -> width, letterbox box), `frameSizeOf` and `gateSettings` use it | 4:3 / 16:10 / 16:9 / 21:9 give 298 / 358 / 398 / 522 x 224; custom 3:1 caps at 544; 3:4 gives frame 256 x 224, box 256 x 341; a pin whose `hostWideW` differs stops the build |
| P2 Settings | `tallRendering` gate, option keys, `GateOptions`, `OPTION_KEY_FEATURE`, migration, profile sections, cascade | old `widescreenAspect: '21:9'` loads as `aspectRatio: '21:9'`; Vanilla Safe yields width 256 |
| P3 UI | `AspectRatioRow` in Picture (own row), choices, descriptions, lock message, Detected / Calculated / letterboxed readout; GameLayer locks and pixel-perfect size use the box | every choice reachable; tall shows bars and the letterbox label |
| P4 (unscheduled) | ultrawide past 2.43 | only on the owner's ask |

| Batch | Model | Files (no overlap) | Order |
|---|---|---|---|
| A | sonnet | `X:/brock/packages/modules/display/src/**` (new aspect folder, renderer export) | parallel with B |
| B | sonnet | `core/reconnect/settings_reconnect.c`, `core/reconnect/ck_reconnect.h`, `core/wasm-build/state-patches.mjs`, `packages/game-core/src/port/{core-config-ini*.ts,gate-settings.ts,frame-size/*,aspect/*}`, `packages/game-core/src/index.ts`, `packages/features/src/gate-options/*` | parallel with A |
| C | sonnet | `packages/features/src/feature-registry/core-features.constants.ts`, `apps/desktop/src/{settings.type.ts,settings.constants.ts}`, `settings-effects/normalise-settings*.ts`, `settings-controls/gate-keys.constants.ts`, `views/ProfileManager/settings-sections/settings-sections.constants.ts` | after B |
| D | sonnet | `screens/game/video/picture.settings.ts`, `settings-controls/{own-row-keys.constants.ts,render-setting-control.tsx}`, new `settings-controls/display/*` (row, choices, constants, cascade: adapted from RotP), `views/GameLayer/**`, `views/GameSession/behavior/useCoreSettings.ts` | after A and C |

Reuse: the control and its sub-components and hooks are reused directly (through Brock); RotP's
`aspect-choices`, `display.constants`, `with-aspect-cascade` are adapted (ChronoKi's presets and gates);
RotP's `ratio-capability/*` is rewritten (no Linear / Ultrawide, 224 lines, letterbox below 8:7).

**Brock: module, not plugin (recommended default).** Brock plugins are build-time (`plugins/snes`: ROM, wasm, vault);
this is a renderer control plus pure math, the same kind as MSU and game info, so it goes to the existing
`brock-display` module next to the refresh-rate helpers RotP already uses. ChronoKi adopts it at once; RotP switches
later at the owner's go (RotP pushes are his).

## 6. Open questions

| # | Question | Recommended default |
|---|---|---|
| 1 | Tall: ship the letterboxed Tall group, hide Tall until the engine draws more lines, or fund the XL engine patch? | Ship letterboxed, labelled as such |
| 2 | Where does the control live: `brock-display` module, or a ChronoKi-local copy of RotP's? | `brock-display` module |
| 3 | Ultrawide past 21:9 (raise the 544 cap, M-L)? | Defer; 21:9 is the top preset |
| 4 | Default ratio for new installs: 16:9 (Steam margins art) or Auto (RotP's recommended note)? | 16:9, with Auto marked "best for most setups" |
