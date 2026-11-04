# Parity review: the Game bucket (I-23)

Read-only comparison of ChronoKi (`apps/desktop`) against RotP (`X:/relic-of-the-past/apps/desktop`), the Game bucket
only: Home, every Game settings or custom page, and the in-game view with its session overlays. Written 2026-11-04 from
the source; RotP has no review screenshots of the Game bucket (its review run has no profile, so only Data and shell
shots exist under `.user-data/Data/review/review/`), so the layout below comes from the code plus `23-hero-data.png` and
`03-menu-view.png` for the shared shell look.

Where the two differ because the games differ, that is said; randomizer, Archipelago, GBA and ALttP-only rows are not to
be copied.

## 1. Bucket structure (side panel)

**RotP** (`src/screens/screens.config.ts`): the Game bucket has four side-panel groups, each a labelled heading in the
side panel, with a header backdrop (`game/game.backdrop.tsx`, the title scene) and a settings target
(`settings: { bucket: 'game', page: 'picture' }`):

| Group | Pages (order) |
|---|---|
| (top) | Home (hero, compact) |
| Video | Picture, Graphics, Camera, Window |
| Gameplay | Gameplay, Audio, HUD, Controls |
| Extras | Bug Fixes, Haptics, Online (experimental), GBA (experimental), Mobile (Capacitor only) |
| App | Contributing |

**ChronoKi**: one group, `gameplay`, holding only Controls. General, Enhancements and Storage sit ungrouped at the
bucket root. No backdrop, no `settings` target (Home's "Settings" button opens `settings` with nothing configured).
Storage is in the Game bucket; RotP keeps Storage in the Data bucket (`data/storage.page.tsx`).

Gaps:

- No Video / Gameplay / Extras / App groups; settings are lumped into "General" and "Enhancements" instead of one page
  per topic.
- Storage is in the wrong bucket (belongs under Data, as in RotP).
- No `settings:` target in `screens.config.ts` (RotP points it at its first video page).
- No Game bucket backdrop (RotP: `game.backdrop.tsx`).

Proposed ChronoKi layout (same groups, CT content):

| Group | Pages |
|---|---|
| Video | Picture (widescreen, aspect, render scale, interpolation, scene fixes, FPS, sync), Window (start fullscreen, window mode, viewport, pixel perfect, linear filtering) |
| Gameplay | Gameplay (Original mode, save states, auto-save, save on quit, turbo), Audio (audio on, master volume, instant sound uploads), Controls |
| Extras | Mobile (Capacitor only, if a notch setting exists) |
| App | Contributing (developer tools, debug logging) |

## 2. Home

### RotP (`game/home.hero.tsx` -> `views/ProfileHub/sub-components/home-tab/HomeHeroContent.tsx`)

Meta: `hero: { size: 'compact' }`, keywords play/start/stop/reset/saves/quick save/auto save/play sessions/progress/import
save. Uses every hero slot:

- **Eyebrow** "Mode", **Title** the profile's mode label (Vanilla / Vanilla Safe / Randomizer ...).
- **Backdrop** the animated title scene; **Art** mode art (pixelated).
- **Actions**: `HubGameControls`: Play when stopped; when running Pause/Resume, Stop (with "Stopping..." spinner), Reset.
- **Tools**: Folder (reveal the profile folder), Import (raw `.srm` from another emulator, with a typed-confirm dialog
  and an invalid-file dialog).
- **Facts**: ROM (name without extension), Last played (relative), Created (relative); a second group for a
  randomizer run (skip).
- **Aside**: last named save tile (screenshot, name, time, Load).
- **Panel**: per-SRAM-file progress (checks taken/available/left; randomizer-flavoured, see below).
- **Body**, two columns:
  - Left: **Quick Saves** (12-slot grid of `SaveSlot`: screenshot, time, Save disabled while stopped, Load),
    **Play Sessions** (session cards: length, when).
  - Right: **Saves** (named `ItemList`: New save inline form with a dated default name, Load, Overwrite (disabled when
    stopped), Delete with armed two-click confirm, rename), **Auto-saves** (`ItemList` tagged On timer / On quit,
    Load, Delete, 6 rows).

### ChronoKi (`game/home.hero.tsx`)

Eyebrow "Home", Title product name, Art the product mark, Tools: ModeBadge + Profiles button, Actions: Open the Library /
Settings / About, Facts: Profile name + app version, Aside: one line of text. No game controls, no saves.

The Play button lives in the game view instead (`views/GameView/GameView.tsx`, centred over the canvas when nothing is
launched), and the session auto-launches when a profile loads (`useAutoLaunch`). `stop()` exists on the session value
but nothing in the UI calls it; there is no Reset and no Pause UI.

### Gaps

- Game controls (Play, Pause/Resume, Stop, Reset) belong in Home's Actions, not over the canvas.
- No Quick Saves grid. Backend is there: 12 quick slots (`CT_QUICK_SLOTS`), port-kit `store.slots.listQuick`,
  `readScreenshot`, `saveState`/`loadState`.
- No named Saves list. Backend is there: port-kit `store.named` (`create`, `list`, `details`, `rename`, `overwrite`,
  `remove`, kind `normal`) and `saveNamedState`/`loadNamedState` in `game/save-states`.
- No Auto-saves list (port-kit named kind `auto`, written by `game/auto-save`).
- No last-save Aside tile.
- No Play Sessions record (needs a small per-profile session log written on start/stop; RotP keeps
  `listSessions`/`saveSession` in `storage/profile-data-store`).
- Facts are app facts (profile name, version), not profile facts (ROM, last played, created).
- Title/Eyebrow: RotP shows the mode as the title ("Mode" / "Vanilla"); ChronoKi shows the product name and puts the
  mode in a badge. Use "Mode" / "Original" or "Enhanced".
- Tools: no Open profile folder, no Import SRAM (CT `.srm`, 8 KiB SRAM; same typed-confirm flow fits).
- Actions: Open Library / Settings / About are navigation the shell menu already gives; RotP has none of them on Home.
- No hero backdrop and no `size: 'compact'`.

### Should differ

- Progress panel: RotP's counts randomizer-style checks. A CT equivalent would be per-SRAM-file facts (character,
  level, play time, location, era) read from the 3 CT save files; nice later, not a parity blocker.
- Randomizer facts group: skip.

## 3. Settings pages, row by row

Column "CT" says whether the RotP row has a Chrono Trigger meaning.

### Video / Picture (RotP `video/picture.settings.ts`)

| RotP row | CT | ChronoKi today |
|---|---|---|
| Extended Rendering | yes | `gate:widescreen` (Enhancements > Display) |
| Linear World Tilemap, Ultrawide, Tall Rendering, Extend Y | no (ALttP PPU) | none, fine |
| Aspect Ratio | yes | `widescreenAspect` (16:9, 16:10, 21:9) under "Picture options", separated from its toggle |
| Widescreen Fixes | yes | `gate:sceneAdjust`, `gate:wideSteamMargins`, `gate:fillBottomLine` (Enhancements group) |
| Widescreen Sprites, Extend Play Area, Off-Screen AI | no (ALttP sprite engine) | none, fine |
| Performance > Show FPS | yes | missing (also no FPS / refresh-rate title-bar items) |
| Performance > V-Sync | yes | core always writes `vsync=1`; `gate:freeSync` switches sync mode, named oddly and filed under Enhancements |

CT extras with no RotP row: Frame interpolation (`gate:interpolate`), Internal resolution (`gate:renderScale` + factor).

### Video / Graphics (RotP `video/graphics.settings.ts`)

Engine (Optimized PPU, Enhanced Mode 7, No Sprite Limit): no CT equivalent in the current core; Mode 7 (Epoch, bike
race) could matter later. Quality: Linear Filtering (CT: `gate:linearFiltering`, in Display gates), Dim Flashes (CT has
flashes, needs core work; later). Overworld Edge Effect, Coloured Rupees, Item Sheen, Hide Space Beyond Walls, Player
Sprite: ALttP-only, skip.

### Video / Camera (RotP `video/camera.settings.ts`)

Lock Camera to View, Smooth Transitions: tied to ALttP extended rendering. No CT page needed until widescreen shows
camera issues.

### Video / Window (RotP `video/window.settings.ts`)

| RotP row | ChronoKi |
|---|---|
| Start in Fullscreen | `startFullscreen` on General |
| Viewport (Letterbox / Fit Window / Stretch) | only a boolean `gate:scaleStretch` ("Stretch to window"); no Fit Window |
| Pixel Perfect (integer scale) | missing |
| (none) | `windowMode` choice and Widget layout Reset on General: keep, move to Window |

### Gameplay / Gameplay (RotP `gameplay/gameplay.settings.ts`)

| RotP section | CT | ChronoKi today |
|---|---|---|
| Game Flow > Auto-Save: Enable, Interval (range 1-30 min), Max entries (1-20), Save on Quit | yes | Enable = `gate:autoSave`, Save on quit = `gate:saveOnQuit` (Saves gate group); Interval under a separate "Save options" section; Max entries fixed at 5 |
| Game Flow > Quick Save Shortcuts: Enhanced Save Slot Shortcut, Hold to Save Duration | yes | missing (no save-slot overlay) |
| Game Flow > Turbo: Turbo, Turbo Speed | yes | `gate:turbo` (Quality of life); speed fixed (`TURBO_EXTRA_FRAMES = 3`) |
| Received Items | no (randomizer) | skip |
| Movement, Combat, Dialog, Quality of Life | ALttP rows; CT keeps battle/message speed in its own Config menu | skip; CT-specific QoL rows can come later from the feature registry |
| Cheats, Tracker | no for now | skip |
| Vanilla Safe | yes | `original` ("Original mode") at the top of Enhancements; keep CT naming |

Save states themselves are a gate (`gate:saveStates`, default off); in RotP quick saves are always on and only the
Enhanced shortcut is optional. Worth a lead decision: with Original mode on by default, save states are off by default,
so Home's quick-save grid would be dead out of the box.

### Gameplay / Audio (RotP `gameplay/audio.settings.ts`)

| RotP row | ChronoKi |
|---|---|
| Master Volume | `masterVolume` on General (with `enableAudio`) |
| Independent Music / SFX, Music, Ambience, SFX volume | core exposes only `volume` and `mute`; skip until the core splits them |
| Music Packs (MSU) | no CT equivalent today; skip |
| Audio Device: Sample Rate, Channels, Buffer Size | not exposed by the core config; later |
| (none) | `gate:instantUploads` ("Instant sound uploads") is an audio setting filed under Enhancements |

The "Audio" gate group exists in `GATE_GROUP_ORDER` but no feature uses it, so `instantUploads` is the one candidate.

### Gameplay / HUD (RotP `gameplay/hud.settings.ts`, `hud-layout.card.tsx`)

ALttP overlay HUD, dialog box, title screen. No CT equivalent; skip.

### Gameplay / Controls (`gameplay/controls.custom.tsx`, both)

Same three-panel shape on both (input profiles | bindings | devices) and the same search entries. Differences:

- RotP wraps each panel in `SearchAnchor` (`input-profiles`, `bindings`, `devices`); ChronoKi declares the same anchors
  in `searchEntries` but renders no `SearchAnchor`, so search results cannot scroll to them.
- RotP asks before applying a controller preset ("Apply Controller Preset" dialog, overwrites bindings); ChronoKi's
  "Reset current to defaults" applies at once.
- RotP has a narrow layout (`useControlsNarrow`) and an Options tab (haptics rows, required inputs). Options/haptics are
  ALttP-driven; the narrow layout is not.
- Tabs: RotP Vanilla Controls / Modern (experimental) / Shortcuts & Functions / Cheats / Options. ChronoKi Game
  Controls / Shortcuts & Functions: right for CT.
- Function actions `screenshot` (bound to F12 by default) and `menu` have no handler in `runFunctionAction`; `pause`
  toggles the input pause manager only, with nothing on screen.

### Extras (RotP Bug Fixes, Haptics, Online, GBA, Mobile)

Bug Fixes: no CT fix list yet (possible later via the feature registry). Haptics: needs game event hooks; skip.
Online, GBA: randomizer / ALttP only; skip. Mobile (`renderIntoNotch`, Capacitor only): ChronoKi targets Android, so a
notch row applies if the shell supports it.

### App / Contributing (RotP `app/contributing.settings.ts`)

RotP: Developer Mode, Experimental Features, Navigation Data, Sanctuary account, Debug logging. ChronoKi: Developer tools
and Debug logging in General's "Developer" section, plus a duplicate `gate:developerTools` in the Dev gate group. Move
to an App > Contributing page and keep one developer switch. Sanctuary, Navigation Data and Experimental are RotP-only.

### General and Enhancements, as they stand

Both pages mix topics, which is the root of the parity gap: Enhancements is generated from the feature registry by
group (Display, Enhancements, Quality of life, Saves, Audio, Input, Dev), then two trailing sections ("Picture options",
"Save options") hold the parameters of toggles that sit sections above them. RotP keeps each toggle and its parameters
in one subsection on its topic page, with a "Needs X" hint. The registry can still drive the rows; the page split and
the row placement should follow RotP.

## 4. In-game view and session overlays

### RotP (`views/GameView`, `views/GameLayer`, `title-bar/*`)

- Stopped: a dim background logo behind the canvas; no Play button (Play is on Home).
- Overlays while running: `PauseLayer` (pause bars; controller-disconnect overlay with resume and profile switch),
  `ProfileSwitcherOverlay` (input profile cycling), `SaveStateOverlay` (slot grid, hold-to-save ring, tap to load,
  Esc cancels), `GameOverlay`, `CheckToasts`, `NavigationOverlay` (ALttP/randomizer), `DebugFloatingControls`
  (debug report button when debug logging is on).
- Title-bar items: Save States (opens the overlay, only while running), frame rate, refresh rate, volume.
- Menu: a "Save States" entry ("Open the save state slots while the game runs").

### ChronoKi (`views/GameView`, `views/GameLayer`)

- Stopped: centred Play button plus a notice line.
- Running: a ModeBadge pinned top-left over the game at all times; error text on core error. Nothing else.
- Title bar: no app items (`.brock/title-bar.ts` is empty); no toolbars.

### Gaps

- Play button over the canvas: remove once Home has the controls; show a background mark when stopped.
- Permanent ModeBadge over gameplay: RotP shows the mode on Home only.
- No save-state overlay or slot feedback: save/load/slot-cycle shortcuts work blind (only a log line).
- No pause overlay; no controller-disconnect pause.
- No input-profile switcher overlay (ChronoKi has `cycle-active-profile` in the input manager but no overlay).
- No Save States / FPS / refresh-rate title-bar items.
- No debug floating controls tied to Debug logging.
- Screenshot shortcut has no handler.
- Skip: CheckToasts, NavigationOverlay, GameOverlay (randomizer/ALttP).

## 5. Work items, most important first

1. Home: Play / Pause-Resume / Stop / Reset in Home's Actions (port `HubGameControls`), wire `stop`, add reset and pause to the session.
2. GameView: drop the centred Play button and the always-on ModeBadge; show a dim mark when stopped.
3. Home: Quick Saves grid, 12 slots from `store.slots.listQuick` with screenshots, Save (running only) and Load.
4. Home: named Saves list (create with dated default name, load, overwrite, rename, armed delete) on `store.named` kind `normal`.
5. Home: Auto-saves list (load, delete, trigger label) on `store.named` kind `auto`, plus the last-save Aside tile.
6. Home: hero to RotP shape: Eyebrow "Mode" + mode title, Facts ROM / Last played / Created, Tools Folder + Import SRAM, compact size, no nav buttons.
7. screens.config: add Video / Gameplay / Extras / App groups, a `settings` target and a game backdrop; move Storage to the Data bucket.
8. Split Enhancements + General into Picture, Window, Gameplay, Audio, Contributing pages, each toggle beside its parameters.
9. Save-state overlay (slot grid, hold to save, tap to load) and a Save States title-bar item while running.
10. Pause overlay for the pause action (and controller-disconnect pause).
11. Auto-save: Max entries setting (replace the fixed 5); Turbo speed setting (replace `TURBO_EXTRA_FRAMES`).
12. Show FPS setting + frame-rate / refresh-rate title-bar items.
13. Window: Viewport choice (Letterbox / Fit / Stretch) replacing the stretch gate, plus Pixel Perfect.
14. Controls: `SearchAnchor` around the three panels; confirm dialog before applying a preset; narrow layout.
15. Screenshot function action handler; input-profile switcher overlay.
16. Remove the duplicate developer switch (gate vs `developerToolsEnabled`); decide if save states should stay a default-off gate.
17. Home: Play Sessions log and section (needs a per-profile session record).
