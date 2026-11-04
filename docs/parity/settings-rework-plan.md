# Settings rework plan: Vanilla Safe and the RotP layout

This plan was made by reading code only. Nothing was built or launched. The sources are ChronoKi `apps/desktop/src/{settings.*,
main.constants.ts, screens/, settings-controls/, settings-nav/, settings-effects/, profiles/, views/ProfileManager/,
views/HomeTab/, views/GameSession/, views/GameLayer/}`, `packages/features/`, `packages/design/src/lock-overlay/` and
`packages/design/src/mode-badge/`; and RotP `apps/desktop/src/screens/game/{video,gameplay}/*.settings.ts`, `main.constants.ts`,
`views/ProfileManager/`, `packages/game-core/src/settings/default-settings.ts` and `packages/features/`. Audio is covered by
`docs/parity/audio-breakdown.md`, which this plan only references.

## Owner asks, and what this plan does about each

| Ask | Plan |
|---|---|
| Remove the profile Mode select. A live "Vanilla Safe" setting with the gating reversed (on blocks everything that is not original) | Rename `original` (default on) to `vanillaSafe` (default off), placed in RotP's spot (Gameplay, last section). Drop `mode` from profiles. The Home hero and the profile facts derive "Vanilla" / "Vanilla Safe" from the setting, as RotP's `modeOf` does |
| Every option behind the same gate system | Each non-original row stays a `FeatureDef` in `@chronoki/features`, rendered through `gateItem` / `OPTION_KEY_FEATURE` and locked with `LockOverlay`, which reads "Disabled in Vanilla Safe mode" and links to the Vanilla Safe row |
| Names and structure follow RotP | Pages Video > Picture, Graphics, Window; Gameplay > Gameplay, Audio, Controls; App > Contributing. The Enhancements page and the Extras group go away. Labels use RotP's words (table a) |
| Widescreen where RotP has it, with RotP's names | Video > Picture > Picture: "Extended Rendering", "Aspect Ratio", "Widescreen Fixes" |
| Sounds in Audio | `instantUploads` moves to Gameplay > Audio > Sound (audio-breakdown.md, batch AUD) |
| Motion where RotP has it | RotP has no "Motion" section. It keeps frame pacing (V-Sync, "smooths scrolling") in Picture > Performance, so Frame Interpolation and Free Sync go there |
| Defaults close to RotP | Table a, column "Target default" |
| Auto-Save and Quick Save as in RotP | Same rows, labels, ranges and defaults; RotP has no "Save States" toggle, so save states are always on |
| Save overlay on by default | `enhancedSaveSlotShortcut` defaults on and is no longer blocked by Vanilla Safe (Q1), so `SaveStateOverlay` rolls in out of the box |
| Audio page only | Its contents stay in audio-breakdown.md; this plan only renames `original` to `vanillaSafe` in that doc's acceptance lines |

## (a) Every setting, against RotP

"Gate" is RotP's lock: **VS** = locked by Vanilla Safe (LockOverlay); **parent** = disabled without an overlay while the parent
row is off; **none** = always usable. In the ChronoKi columns, `gate:x` is a feature toggle stored in `gates`; the other rows are
plain keys of `AppSettings`.

| # | ChronoKi today (page > section: label, key, default) | RotP counterpart (page > section: label, key, default, gate) | Target (page > section: label, default, gate) |
|---|---|---|---|
| 1 | Picture > Widescreen: Widescreen, `gate:widescreen`, off | Picture > Picture: Extended Rendering, `extendedRendering`, off, VS | Picture > Picture: **Extended Rendering**, off, VS |
| 2 | Picture > Widescreen: Aspect Ratio, `widescreenAspect`, 16:9 (16:9, 16:10, 21:9) | Picture > Picture: Aspect Ratio, `aspectRatio`, 16:9, VS | Picture > Picture: **Aspect Ratio**, 16:9, VS via widescreen + parent (hint "Needs Extended Rendering.") |
| 3 | Enhancements > Widescreen: Scene Adjustments, `gate:sceneAdjust`, off | Picture > Picture: Widescreen Fixes, `widescreenVisualFixes`, **on**, VS | Picture > Picture: **Widescreen Fixes**, **on**, VS + requires widescreen |
| 4 | Enhancements > Widescreen: Steam Margins, `gate:wideSteamMargins`, off | none (closest: Graphics > Enhancements > Edge Effect, on) | Picture > Picture: Steam Margins, **on**, VS + requires widescreen + Steam data. *No counterpart* |
| 5 | Enhancements > Widescreen: Fill Bottom Lines, `gate:fillBottomLine`, off | none (closest: Picture > Extend Y, on, which shows 240 lines) | Picture > Picture: Fill Bottom Lines, off, VS. *No counterpart*. It sits where Extend Y sits. It stays off because RotP's Extend Y only acts in Original ratio |
| 6 | Picture > Resolution: Internal Resolution, `gate:renderScale`, off | none (closest: Graphics > Rendering > Engine) | Graphics > Rendering > Engine: Internal Resolution, off, VS. *No counterpart* |
| 7 | Picture > Resolution: Render Scale, `renderScale`, 2x (2x to 4x) | none | Graphics > Rendering > Engine: Render Scale, 2x, VS via renderScale + parent (hint "Needs Internal Resolution."). *No counterpart* |
| 8 | Picture > Performance: Show FPS, `showFps`, off | Picture > Performance: Show FPS, `displayPerfInTitle`, off, none | Picture > Performance: Show FPS, off, none (no change) |
| 9 | Enhancements > Motion: Frame Interpolation, `gate:interpolate`, off | none (Performance holds V-Sync, off, an engine hook here) | Picture > Performance: Frame Interpolation, off, VS. *No counterpart* |
| 10 | Enhancements > Motion: Free Sync, `gate:freeSync`, off | none | Picture > Performance: Free Sync, off, VS. *No counterpart* |
| 11 | Window > Window: Linear Filtering, `gate:linearFiltering`, off | Graphics > Rendering > Quality: Linear Filtering, `linearFiltering`, off, none (Pixel Perfect turns it off) | Graphics > Rendering > Quality: Linear Filtering, off, **none** (Q1); parent: disabled while Pixel Perfect is on |
| 12 | Window > Window: Start in Fullscreen, `startFullscreen`, off | Window > Window: same, off, none | No change |
| 13 | Window > Window: Viewport, `viewportConstraint`, Letterbox; forced to Letterbox while `original` | Window > Window: Viewport, `viewportConstraint`, none (Letterbox), none | Window > Window: Viewport, Letterbox, **none** (Q1); the hint "Original Mode always uses Letterbox." is dropped |
| 14 | Window > Window: Pixel Perfect, `pixelPerfect`, off | Window > Window: Pixel Perfect, off, parent (needs Letterbox) | Window > Window: Pixel Perfect, off, parent only (Q1) |
| 15 | Gameplay > Game Flow > Auto-Save: Enable Auto-Save, `gate:autoSave`, off | Gameplay > Game Flow > Auto-Save: Enable Auto-Save, `autoSaveEnabled`, off, none | Same place, label and default; gate none (stays `affectsVanillaParity: false`) |
| 16 | same: Auto-Save Interval, `autoSaveIntervalSeconds`, 5 min (1 to 30) | same: Auto-Save Interval, 300 s (60 to 1800, step 60), parent | Same; parent: disabled while Enable Auto-Save is off (hint "Needs Enable Auto-Save.") |
| 17 | same: Max Auto-Save Entries, `autoSaveMaxEntries`, 5 (1 to 20) | same: Max Auto-Save Entries, 5 (1 to 20), parent | Same; parent |
| 18 | same: Save on Quit, `gate:saveOnQuit`, off | same: Save on Quit, `saveOnQuit`, **on**, none | Same place, **on**, none |
| 19 | Gameplay > Quick Save Shortcuts: Save States, `gate:saveStates`, nominally on (really off: `gates` starts empty) | none (quick saves are always on) | **Row removed.** Save states are always on: `normalise` keeps `saveStates` in `gates` |
| 20 | same: Hold Save for Slot Picker, `gate:enhancedSaveSlotShortcut`, nominally on (really off) | Quick Save Shortcuts: Enhanced Save Slot Shortcut, `enhancedSaveSlotShortcut`, **on**, none | Same place: **Enhanced Save Slot Shortcut**, **on**, **none** (Q1). This turns the top overlay on by default |
| 21 | same: Hold to Save Duration, `saveHoldDuration`, 2 s (1 to 5, step 0.5) | same: Hold to Save Duration, 2 s, parent | Same; hint "Needs Enhanced Save Slot Shortcut." |
| 22 | Gameplay > Turbo: Turbo, `gate:turbo`, off | Gameplay > Turbo: Turbo, `turboEnabled`, off, none | Same, off, **none** (Q1) |
| 23 | same: Turbo Speed, `turboSpeed`, **4x** | same: Turbo Speed, **2x** (1.25x to 10x), parent | Same, **2x**, parent ("Needs Turbo on.") |
| 24 | Gameplay > Original Mode: Original Mode, `original`, **on** | Gameplay > Vanilla Safe: Vanilla Safe, `vanillaSafe`, **off** | Gameplay > **Vanilla Safe**: **Vanilla Safe**, **off**; changing it restarts the game, as today |
| 25 | Audio > Volume: Master Volume, `masterVolume` / `masterMuted`, 100 / unmuted | Audio > Volume: Master Volume, 100 / unmuted, none | Per audio-breakdown.md (batch AUD) |
| 26 | Enhancements > Sound: Instant Sound Uploads, `gate:instantUploads`, off | none | Audio > Sound, off, VS (audio-breakdown.md, batch AUD). *No counterpart* |
| 27 | Contributing: Developer Mode, `developerToolsEnabled`, off | Contributing: Developer Mode, off (a feature in RotP, `affectsVanillaParity`) | No change in this rework. The gate model already hides `kind: 'dev'` features in packaged builds; making Developer Mode a feature is a follow-up |
| 28 | Contributing: Allow Debug Logging, `allowDebugLogging`, off | same, off | No change |
| 29 | Hidden: `windowMode`, `enableAudio`, `steamDataImported`, `volumeScale?` | RotP: same Brock base keys | No change (`volumeScale` keeps its migration) |
| 30 | Profile: Mode (Original / Enhanced), `profile.mode`, Original. Decorative: nothing at runtime reads it | none stored; the badge comes from `vanillaSafe` (`modeOf`), and the create wizard has a "Preset" (Vanilla / Enhanced) that only seeds settings | **Removed.** Label derived from `vanillaSafe`; wizard per Q2 |

RotP rows with no CT use are left out: Linear World Tilemap, Ultrawide, Tall Rendering, Extend Play Area, Off-Screen AI, Optimized PPU,
Enhanced Mode 7, No Sprite Limit, Dim Flashes, Coloured Rupees, Item Sheen, Hide Space Beyond Walls, Player Sprite, Camera, HUD,
Received Items, Movement, Combat, Dialog, Quality of Life, Cheats, Tracker, Bug Fixes, Haptics, Mobile and Online. V-Sync, the Music/SFX
split, MSU and the audio device are left out too, because they need engine hooks.

## (b) Gate model, data model, migration, files

### Gate model

- `vanillaSafe: boolean` replaces `original` everywhere it is read. `resolveGates(requested, { vanillaSafe, packaged, satisfied })`
  is unchanged: it already drops every `affectsVanillaParity` feature when `vanillaSafe` is true.
- **Defaults come from the registry.** A new `packages/features/src/default-gates.ts` exports
  `DEFAULT_GATES = FEATURE_REGISTRY.filter(f => f.default).map(f => f.id)`. `DEFAULT_SETTINGS.gates` uses it. Today `FeatureDef.default` is
  never read, which is why save states and the slot shortcut are off despite `default: true`.
- Registry changes (`core-features.constants.ts`, `host-features.constants.ts`):
  - `widescreen`: label "Extended Rendering", description RotP-style ("Enables the widescreen picture. Off is fixed 4:3.").
  - `sceneAdjust`: label "Widescreen Fixes", default on, `userMessage` "Needs Extended Rendering.".
  - `wideSteamMargins`: default on, `userMessage` "Needs Extended Rendering.".
  - `enhancedSaveSlotShortcut`: label "Enhanced Save Slot Shortcut", RotP description, default on.
  - `saveOnQuit`: default on.
  - `saveStates`: default on, kept as a feature so that `hostGate('saveStates')` still works, with no settings row.
  - If Q1 = recommended: `affectsVanillaParity: false` for `turbo`, `linearFiltering` and `enhancedSaveSlotShortcut`.
- **Lock wording**: `LockOverlay.constants.ts` `vanillaSafe: 'Disabled in Vanilla Safe mode'`. The overlay's settings link opens
  `VANILLA_SAFE_KEY = 'vanillaSafe'` (`settings-nav.constants.ts`, replaces `ORIGINAL_MODE_KEY`).
- **Parent disabling (RotP's no-overlay disable)**: `is-setting-disabled.ts` disables an option row when the feature it hangs off
  (`OPTION_KEY_FEATURE`) is not effective. That covers Aspect Ratio, Render Scale, Auto-Save Interval, Max Auto-Save Entries, Hold to
  Save Duration and Turbo Speed. Pixel Perfect is disabled unless the viewport is Letterbox, and Linear Filtering while Pixel Perfect is on.
  The `original`-based viewport and pixel-perfect rules are deleted, here and in `useViewport.ts` (Q1).
- Gate rows keep `key: 'gate:<id>'`. Known gap, unchanged: `brock sync` skips `gateItem()` rows, so they are not in `.brock/search.ts`.
  That is a follow-up item, not part of this rework.

### Data model

- `settings.type.ts`: `original` → `vanillaSafe`. Everything else stays.
- `settings.constants.ts`: `vanillaSafe: false`, `gates: DEFAULT_GATES`, `turboSpeed: 2`. `game/turbo/turbo.constants.ts`
  `TURBO_DEFAULT_SPEED = 2`.
- `settings-effects.constants.ts`: `RESTART_ALWAYS_KEYS = ['vanillaSafe']`.
- Profiles: `mode` leaves `profile.type.ts` (ProfileExtension, Create, Patch), `profiles/types/profile.type.ts` (ProfileMode),
  `chronoki-profile-hooks.ts` (build and patchable become `['romFile']`), `profiles.constants.ts` (DEFAULT_PROFILE_MODE) and the
  wizard values.
- Home: `useGateMode` keeps returning `'original' | 'modified'` for the session recorder (its records stay readable), now from
  `vanillaSafe` plus the gates. The hero label comes from a new `useProfileMode()` that returns `'vanilla-safe' | 'vanilla'`, with labels
  "Vanilla Safe" / "Vanilla" (RotP `MODE_BADGE_LABELS`).

### Migration (existing users)

Brock's settings store loads `normalise(mergeSettings(defaults, stored), stored)` and saves the whole object on the next patch.
A new `apps/desktop/src/settings-effects/normalise-settings.ts` is wired in `main.constants.ts` (`SETTINGS = { defaults, normalise,
...SETTINGS_CONTROLS }`), as RotP wires its own:

1. `vanillaSafe = stored?.vanillaSafe ?? stored?.original ?? false`, then `delete settings.original`. An explicit choice carries over.
   A config that never stored `original` got Original Mode on only as the default, and now gets Vanilla Safe off (Q3).
2. **One-time default gates**: when `stored` has a `gates` array but no `vanillaSafe` key (a config from before the rework), append the
   ids whose default became on and that are missing: `saveStates`, `enhancedSaveSlotShortcut`, `saveOnQuit`, `sceneAdjust`,
   `wideSteamMargins`. This runs once only, because the next save writes `vanillaSafe`. A user who later turns one of them off keeps
   it off.
3. Always force `saveStates` into `gates` (there is no row left to turn it off).
4. `turboSpeed` is left alone: a stored 4 stays 4, and only new configs get 2.

Profiles: `profile.json` files keep a stale `mode` key. Brock has no read hook for profiles, and after this rework nothing reads
`mode`, so it is ignored and dropped the next time Brock rewrites the file. No profile migration code is needed. The per-profile
`config.json` goes through the same `normalise`, because the settings store loads it. The read-only Settings tab in Profile Manager
(`useProfileSettings`, raw `readConfig`) calls `normaliseSettings` too, so a profile that has not been opened since the rework
shows Vanilla Safe correctly.

### Every file that changes

| File | Change | Batch |
|---|---|---|
| `packages/features/src/feature-registry/core-features.constants.ts` | labels and defaults (widescreen, sceneAdjust, wideSteamMargins) | A |
| `packages/features/src/feature-registry/host-features.constants.ts` | labels and defaults; parity flags per Q1 | A |
| `packages/features/src/default-gates.ts` (new), `packages/features/src/index.ts` | DEFAULT_GATES | A |
| `packages/features/tests/resolve-gates.test.ts` | `ALLOWED_IN_ORIGINAL` gains turbo, linearFiltering and enhancedSaveSlotShortcut (Q1); rename to `ALLOWED_IN_VANILLA_SAFE` | A |
| `packages/design/src/lock-overlay/LockOverlay.constants.ts` | "Disabled in Vanilla Safe mode" | A |
| `apps/desktop/src/settings.type.ts`, `settings.constants.ts`, `main.constants.ts` | vanillaSafe, DEFAULT_GATES, turboSpeed 2, normalise | A |
| `apps/desktop/src/settings-effects/normalise-settings.ts` (new), `settings-effects.constants.ts` | migration, restart key | A |
| `apps/desktop/src/settings-controls/{lock-cause-of.ts, is-setting-disabled.ts, useGateMode.ts, lock-overlay.tsx, gate-keys.constants.ts}` | vanillaSafe, parent disabling, link key | A |
| `apps/desktop/src/settings-nav/settings-nav.constants.ts` | VANILLA_SAFE_KEY | A |
| `apps/desktop/src/views/GameSession/behavior/useCoreSettings.ts` | `vanillaSafe` into resolveGates | A |
| `apps/desktop/src/views/GameLayer/behavior/useViewport.ts` | drop the forced Letterbox (Q1) | A |
| `apps/desktop/src/game/turbo/turbo.constants.ts` | TURBO_DEFAULT_SPEED 2 | A |
| `standards.config.mjs` (new, repo root) | `export default { options: { allow: ['enhanced'] } };` as in RotP, so "Enhanced Save Slot Shortcut" passes the prose lint | A |
| `docs/parity/audio-breakdown.md` + the files it lists | Sound section in Audio; its acceptance text says `vanillaSafe` | AUD |
| `apps/desktop/src/screens/screens.config.ts` | drop the `extras` group | B |
| `apps/desktop/src/screens/game/video/picture.settings.ts` | sections Picture, Performance (rows 1 to 5, 8 to 10) | B |
| `apps/desktop/src/screens/game/video/graphics.settings.ts` (new, order 2, icon `palette`) | Rendering > Engine, Quality (rows 6, 7, 11) | B |
| `apps/desktop/src/screens/game/video/window.settings.ts` | order 4, rows 12 to 14, hints | B |
| `apps/desktop/src/screens/game/gameplay/gameplay.settings.ts` | RotP labels, hints and keywords; no Save States row; section `vanilla-safe` last | B |
| `apps/desktop/src/screens/game/extras/enhancements.settings.ts` | deleted (after AUD has taken Sound out) | B |
| `apps/desktop/.brock/screens.ts`, `.brock/search.ts` | regenerated by `brock sync` (checker chore), committed with B | B |
| `apps/desktop/src/profile.type.ts`, `profiles/types/profile.type.ts`, `profiles/chronoki-profile-hooks.ts`, `profiles/storage/profiles.constants.ts`, `profiles/storage/create-profile.ts` | drop `mode` | C |
| `apps/desktop/src/views/ProfileManager/{ProfileManager.constants.ts, ProfileManager.type.ts, behavior/build-profile-facts.ts, behavior/useProfileSettings.ts, sub-components/ProfileOverviewTab.tsx}` | drop the Mode select and constants; the facts show the derived label; normalise on read | C |
| `apps/desktop/src/views/ProfileManager/ProfileCreateWizard/{ProfileCreateWizard.constants.ts, ProfileStepBody.tsx, behavior/profile-wizard-steps.ts, behavior/useProfileWizard.ts}` | drop the Mode step; Preset per Q2 | C |
| `apps/desktop/src/profiles/presets/` (new, if Q2 = Preset) | VANILLA / ENHANCED config overrides used as `initialConfig` | C |
| `apps/desktop/src/settings-sections/settings-sections.constants.ts` | `{ key: 'vanillaSafe', label: 'Vanilla Safe' }` | C |
| `apps/desktop/src/screens/data/library/profiles.page.tsx` | keywords: drop mode, original and enhanced; add vanilla, preset | C |
| `apps/desktop/src/views/HomeTab/HomeTab.constants.ts`, `screens/game/home.hero.tsx`, `profiles/useProfileMode.ts` (new) | hero shows "Vanilla" / "Vanilla Safe" | C |

## (c) Coder batches

Every brief says: **no tests, lint, typecheck, build or app launch; edit, commit, return**. Each coder works in its own worktree,
uses `sonnet`, and returns a five-line report.

- **A, settings core** (one coder; it owns settings.type.ts, settings.constants.ts, useCoreSettings.ts and every A row above). No `.brock/*`.
  Acceptance:
  - `original` appears nowhere in `apps/desktop/src` or `packages/` outside `normalise-settings.ts`.
  - `DEFAULT_SETTINGS.gates` equals `DEFAULT_GATES`, which holds saveStates, enhancedSaveSlotShortcut, saveOnQuit, sceneAdjust and wideSteamMargins.
  - `normalise` maps `{ original: true }` to `vanillaSafe: true`, maps `{ original: false, gates: [] }` to `vanillaSafe: false` plus the five new-default ids, and a second pass over its own output changes nothing.
  - The lock overlay reads "Disabled in Vanilla Safe mode" and opens the `vanillaSafe` row.
  - Option rows are disabled while their parent feature is off.
  - The resolve-gates test lists the features that stay usable under Vanilla Safe.
- **AUD, audio** (one coder, runs alongside A because no files overlap): exactly `docs/parity/audio-breakdown.md` section 5, with "`original` is on"
  read as "Vanilla Safe is on". Acceptance: as in that doc.
- **B, screens** (one coder, after A and AUD have merged): `screens.config.ts`, the picture, graphics (new) and window settings,
  `gameplay.settings.ts`, and deleting `enhancements.settings.ts`. Acceptance:
  - Settings shows Video (Picture, Graphics, Window), Gameplay (Gameplay, Audio, Controls) and App (Contributing), with no Extras.
  - Every row from table a appears in its target place, under its target label.
  - Vanilla Safe is the last section of Gameplay.
  - Every hint says "Needs <RotP parent label>.".
  The lead runs the checker chore after B, as one `pnpm --filter chronoki-desktop sync`, and commits the regenerated `.brock/*` on B's branch.
- **C, profiles and Home** (one coder, after A; it can run alongside B because no files overlap): every C row. Acceptance:
  - There is no Mode select or Mode wizard step, and the `ProfileMode` type is gone.
  - Profile facts and the Home hero say "Vanilla" or "Vanilla Safe" according to that profile's `vanillaSafe`.
  - A `profile.json` that still has `mode` loads without error.
  - The read-only Settings tab shows Vanilla Safe.
  - If Q2 = Preset: the Profile step has a "Preset" control (Vanilla / Enhanced, default Enhanced), and creating a profile writes that preset's `initialConfig`.
- **Check** (one `haiku` checker after B and C have merged): typecheck and lint on the changed files, plus
  `packages/features/tests/resolve-gates.test.ts` and the tests of touched files, against main. It reports failures only, and the lead
  routes each one to the batch that owns the file.

Order: A and AUD in parallel; then B and C in parallel; then sync, then check.

## (d) Owner questions

- **Q1. Under Vanilla Safe, do host conveniences stay usable as they are in RotP?** These are Turbo, Linear Filtering, Enhanced Save
  Slot Shortcut, Viewport and Pixel Perfect. RotP locks only what changes the game itself.
  **Recommended: yes, as in RotP.** Otherwise they stay locked, and the top save overlay is off whenever Vanilla Safe is on.
- **Q2. What replaces the wizard's Mode step?** RotP has a "Preset" (Vanilla / Enhanced, default Enhanced) that only seeds the new
  profile's settings. **Recommended: the RotP Preset.**
  - Vanilla seeds `{ vanillaSafe: true }`.
  - Enhanced seeds DEFAULT_GATES plus autoSave, widescreen, sceneAdjust, wideSteamMargins, fillBottomLine, renderScale and interpolate, with
    `showFps: true`, `pixelPerfect: true` and `saveHoldDuration: 1`.
  The other choice is to drop the step entirely, so new profiles start on the defaults.
- **Q3. Existing profiles never had Original Mode set by hand; it was simply on by default. What should they start with?**
  **Recommended: Vanilla Safe off (RotP's default).** A value someone did set explicitly carries over either way. The other choice
  is to carry the old default over too (Vanilla Safe on).
