# Peer review, round 1: ChronoKi against RotP, screen by screen

Reviewer: an independent peer review, done by reading code only (no builds, tests or launches).
Date: 2026-11-04. The comparison is ChronoKi `main` at `f24128a` against RotP's `apps/desktop` in its current state.

Paths are relative to each repository root:
- RotP = `X:/relic-of-the-past`
- ChronoKi = `X:/chronoki`

Most app paths sit under `apps/desktop/src`, written below as `src/`.

Requirements used: `plans/chronoki-port.html` (the RotP part, Gates and Options tables) and `CLAUDE.md`.

Out of scope as briefed, so not counted:
- Hookshop, Sanctuary and the Studios
- The ALttP-only parts (Camera and Graphics pages, HUD, Online, Dialog, randomizer)
- Anything that needs hooks inside the Chrono Trigger engine

## Landed from the earlier reviews (no action)

The earlier reviews are `game-screens.md` and `data-and-shell.md`. These asks landed:

- **BrockApp props:** `legalText`, `volume`, `developerTools`, `dataDomains`, `bugReport`, `profileHooks`, `restoreNavigation={false}` (`src/main.tsx`).
- **Screen config:** the settings target is `game/picture`, and the groups are video, gameplay, extras and app (`src/screens/screens.config.ts`). `profilesRoute: 'data/profiles'` is set.
- **Shell module:** log channels and the Save States menu.
- **Title bar:** the same four items as RotP (volume, save states, frame rate, refresh rate).
- **Home hero:**
  - mode eyebrow and title (Original or Enhanced), backdrop, product-mark art
  - HubGameControls, Folder and Import tools
  - ROM, Last played and Created facts, and the last-save aside
  - quick, normal and auto saves, and play sessions
- **Game view:** the idle mark when not running, SaveStateOverlay, PauseOverlay with a disconnect card, and ProfileSwitcherOverlay.
- **Data pages:** Profiles, ROMs and Storage exist, with ListDetailLayout and the create wizard.
- **Other:** the Credits card. On Controls: SearchAnchor sections and the preset confirm.
- **Hero art:** the ChronoKi mark stands in for RotP's per-mode hero art. This is correct under the no-Chrono-Trigger-art rule.

## Not counted (out of scope or no Chrono Trigger equivalent)

- **V-Sync row:** needs a core pacing hook. `ct_settings.ini` hard-codes `vsync=1`, and port-kit has no pacing option.
- **Audio:** the Music/SFX/Ambience split, Music Packs and MSU (engine hooks or Studios). Audio Device (sample rate, channels, buffer) needs core config.
- **Haptics event rows:** sword, damage, items and environment all need engine hooks.
- **Controller report:** the device-card action, the report host and the controller-report store are Sanctuary-backed.
- **Widget defaults and RotP's ALttP widgets.** ChronoKi's widget list is empty, and that is correct.
- **ALttP or Sanctuary pages and rows:**
  - the GBA page and the Received Items, Movement, Combat and Dialog sections
  - Experimental Features, Navigation Data and the Sanctuary account rows
  - the `widgetDisabled` and `showFlags` props

---

## 1. App shell: main, config, title bar, bug report

### S1. Debug capture and debug report controls are missing (major)
- **RotP evidence:**
  - `src/compounds/DebugFloatingControls/DebugFloatingControls.tsx`, rendered by `src/views/GameView/GameView.tsx`. It is a draggable capture button plus a report button, shown while `allowDebugLogging` is on, the game is running and a profile is active.
  - `src/views/BugReportRecordings/BugReportRecordings.tsx`, passed as `bugReport={{ section: BugReportRecordings }}` in `src/main.tsx`.
  - The function `toggle-debug-capture` (default Tab) in `packages/features/src/controls/functions/functions.constants.ts`.
  - The setting description in `src/screens/game/app/contributing.settings.ts`.
- **ChronoKi:**
  - `src/main.tsx` passes `chronokiBugReport = { contact: true, attachments: true }` with no recordings section.
  - `src/views/GameView/GameView.tsx` has no floating debug controls.
  - `packages/input-mapping/src/functions/function-actions.constants.ts` has no capture function.
  - In `src/main.tsx` dataDomains, the logs domain description does not mention captures.
- **Change:**
  1. Port DebugFloatingControls into `src/compounds/DebugFloatingControls/` and render it from GameView under the same three conditions.
  2. Add a recordings section component and pass it as `bugReport.section`, keeping `contact` and `attachments`.
  3. Add the function `toggle-debug-capture` (label "Toggle Debug Capture"). Bind it to a free key, because Tab is taken by Turbo in ChronoKi (see K1).
  4. Change the logs domain description to "Logs and debug captures".
  5. Capture records only app-side data (logs, input, frame timing), so it needs no engine hook.

### S2. Title-bar FPS and refresh-rate items open a page that does not exist (major)
- **RotP evidence:** `src/hooks/useFrameRateTitleBarItem.ts` opens `game/picture`, where Show FPS lives. RotP's refresh-rate item opens a stale `game/display`; do not copy that.
- **ChronoKi:** `src/title-bar/useFrameRateTitleBarItem.ts` and `src/title-bar/useRefreshRateTitleBarItem.ts` both call `nav.open('game/general')`. No `general` page exists.
- **Change:** set both `onSelect` targets to `nav.open('game/picture')`. Show FPS moves there in P2.

### S3. brock.config lacks copyright and wordmark (minor)
- **RotP evidence:** `apps/desktop/brock.config.ts` has `copyright: 'Copyright (c) 2026 drizztdourden_'` and `icons.wordmark`.
- **ChronoKi:** `apps/desktop/brock.config.ts` has neither.
- **Change:**
  1. Add `copyright: 'Copyright (c) 2026 drizztdourden_'`.
  2. Add `icons.wordmark` pointing to a ChronoKi wordmark asset made from the ChronoKi mark (no Chrono Trigger lettering), then regenerate `.brock`.

### S4. Own-row tabs are not applied (minor)
- **RotP evidence:** `src/main.tsx` wraps the tree in `withOwnRowTabs(screenTree)`, so rows marked `chrome: false` (Bug Fixes) render on their own row.
- **ChronoKi:** `src/main.tsx` passes the tree unwrapped.
- **Change:** port `withOwnRowTabs` and wrap the tree the same way. The Enhancements page (P1) needs it.

### S5. Volume scale differs from RotP (minor)
- **RotP evidence:** `src/main.constants.ts` uses `volumeFromSettings({ ..., max: 100 })`, and the audio settings use 0 to 100.
- **ChronoKi:** `src/main.constants.ts` uses `max: 1`, and `masterVolume` is 0..1 (`src/screens/game/gameplay/audio.settings.ts`).
- **Change:**
  1. Store `masterVolume` as 0 to 100 (default 100) and set `max: 100`.
  2. Map it to 0..1 where the audio output reads it.
  3. Add a one-line settings migration that multiplies existing values that are at most 1 by 100.

---

## 2. Home (`game` hero)

### H1. Column layout does not match RotP (major)
- **RotP evidence:** `src/views/ProfileHub/sub-components/home-tab/HomeTabColumns.tsx` and `HomeTabColumns.css`:
  - left column (`home-tab__col-left`): Quick Saves, then Play Sessions
  - right column (`home-tab__col-right`): Saves, then Auto-saves
- **ChronoKi:** `src/views/HomeTab/HomeTab.tsx`. The left column is Quick Saves only; the right column is Saves, Auto-saves and Play Sessions.
- **Change:** move `PlaySessionsSection` into the left column under Quick Saves, and leave Saves and Auto-saves on the right. Copy RotP's column and section-header CSS classes and sizes.

### H2. Loading while the game is stopped does nothing (major)
- **RotP evidence:**
  - `src/views/ProfileHub/sub-components/home-tab/ensure-game-running.ts` starts the game and waits for the core (`whenCoreReady`, BOOT_WAIT_MS 120000) before any load.
  - `useQuickSaveActions.ts`, `useNormalSaveActions.ts`, `useAutoSaveActions.ts` and `load-stored-save.ts` all call it.
  - Quick slots disable only Save while stopped.
- **ChronoKi:**
  - `src/views/HomeTab/behavior/useQuickSaves.ts` passes `disableLoad={!running}`.
  - `useNormalSaves.ts`, `useAutoSaves.ts` and the hero last-save load return silently when `activeStateContext()` is null.
- **Change:**
  1. Add `src/views/HomeTab/behavior/ensure-game-running.ts`: start the active profile's game if it is stopped, then await core ready with a 120 s timeout.
  2. Call it at the start of every load action (quick, normal, auto, hero tile).
  3. Remove `disableLoad={!running}`; keep `disableSave={!running}`.

### H3. SRAM import has no checksum check, and is locked while running (major)
- **RotP evidence:**
  - `packages/game-core/src/save-file/sram-slots/valid-sram-slots.ts`
  - `src/views/ProfileHub/sub-components/home-tab/useHomeTabSramImport.ts` shows "Verified: N of 3 save slot(s) pass the game's checksum." and an invalid-checksum dialog (`HomeTabDialogs.tsx`).
  - Import stays available while the game runs.
- **ChronoKi:**
  - `src/views/HomeTab/behavior/useHomeSramImport.ts` checks only the file size.
  - `src/compounds/ProfileHero/ProfileHero.constants.ts` has `IMPORT_STOPPED_HINT`, and Import is disabled while running.
- **Change:**
  1. Add `validSramSlots(bytes)` to `packages/game-core` using the Chrono Trigger SRAM layout: 3 slots plus per-slot checksums. This is the save format only, not game data.
  2. Show the same "Verified: N of 3..." line and the invalid-checksum confirm dialog.
  3. Allow import while running the way RotP does: stop, write, then restart. If the core cannot do that safely, record a board decision and keep the lock.

### H4. No per-save progress panel (major)
- **RotP evidence:** `src/compounds/ProfileHero/sub-components/HeroProgress.tsx`, a Panel with progress per SRAM file.
- **ChronoKi:** `src/screens/game/home.hero.tsx` and `src/views/HomeTab/*` have none.
- **Change:**
  1. Add `src/compounds/ProfileHero/sub-components/HeroProgress.tsx`, one row per valid SRAM slot (from H3) showing lead character, level, play time, and era or location. Read these from SRAM, with names from game-data (the plan's eras and locations for save labels).
  2. Render it in the Panel slot as RotP does.
  3. Show "No saves yet" when no slot is valid.

### H5. Auto-save rows are named by timestamp, not by trigger (minor)
- **RotP evidence:** `AUTO_TRIGGER_LABELS = { timer: 'On timer', quit: 'On quit' }` in `src/views/ProfileHub/sub-components/home-tab/home-tab.constants.ts`. The date shows in the row meta.
- **ChronoKi:** `src/game/auto-save/write-auto-state.ts`, `auto-save-tick.ts` and `save-state-on-quit.ts` store `${'Auto'|'Quit'} ${toLocaleString()}` as the name.
- **Change:**
  1. Store a `trigger: 'timer' | 'quit'` field on auto-saves.
  2. Render the name from `{ timer: 'On timer', quit: 'On quit' }` and the time as meta, as RotP does.
  3. Read old entries by parsing their "Auto" or "Quit" prefix.

### H6. Play sessions list style and limit differ (minor)
- **RotP evidence:** `src/views/ProfileHub/sub-components/home-tab/sections/PlaySessionsSection.tsx` and its CSS: a bordered surface with dividers, max-height 360 px, scrolling, and `SESSION_LIST_LIMIT = 20`.
- **ChronoKi:** `src/views/HomeTab/sections/PlaySessionsSection.tsx` uses a plain gap list. `SESSION_LIST_LIMIT` in `src/views/HomeTab/HomeTab.constants.ts` is 10.
- **Change:** copy RotP's list container class and CSS (border, dividers, max-height 360, overflow auto) and set the limit to 20.

### H7. Home keywords and null-profile guard (minor)
- **RotP evidence:** the meta in `src/screens/game/home.hero.tsx` has the keywords 'play sessions' and 'progress', and the hero returns null when there is no active profile.
- **ChronoKi:** `src/screens/game/home.hero.tsx` lacks both keywords and renders with no profile.
- **Change:** add the keywords 'play sessions' and 'progress', and `if (!profile) return null;` at the top of the hero.

---

## 3. Game area and overlays

### G1. Save-state overlay and quick-save shortcuts do not match RotP's model (major)
This one finding covers three parts of one feature: the overlay, its two settings, and the per-slot functions.

- **RotP evidence:**
  - `src/views/SaveStateOverlay/SaveStateOverlay.tsx` shows a per-slot shortcut label (F1 to F12) and an enter and exit animation.
  - `src/views/SaveStateOverlay/sub-components/OverlayHints.tsx` shows glyph hints: "Tap to load", "Hold to save" with a ProgressRing, "Saving...", and "Cancel" (Esc).
  - The settings are the "Quick Save Shortcuts" subsection in `src/screens/game/gameplay/gameplay.settings.ts`:
    - `enhancedSaveSlotShortcut` ("Enhanced Save Slot Shortcut")
    - `saveHoldDuration` ("Hold to Save Duration", range 1 to 5, step 0.5, seconds, hint "Needs Enhanced Save Slot Shortcut.")
  - The functions `save-state-1..12` and `load-state-1..12` are in `packages/features/src/controls/functions/functions.constants.ts`.
- **ChronoKi:**
  - `src/views/SaveStateOverlay/SaveStateOverlay.tsx` shows static text ("Hold the save key to save, tap it to load, Esc to close") and has an enter animation only.
  - `src/game/save-overlay/save-overlay.constants.ts` fixes `HOLD_TO_SAVE_MS = 1000`.
  - `packages/input-mapping/src/functions/function-actions.constants.ts` has only a slot-cycling model (save-state, load-state, slot-next, slot-prev).
  - `src/screens/game/gameplay/gameplay.settings.ts` has no Quick Save Shortcuts subsection.
- **Change:**
  1. Add the functions `save-state-1..N` and `load-state-1..N` (N = port-kit quick slot count), default F1.. for save and Shift+F1.. for load, as RotP binds them.
  2. Add the settings `enhancedSaveSlotShortcut` (default on) and `saveHoldDuration` (default 1, range 1 to 5, step 0.5). Gate them as host features in `packages/features`, and add the "Quick Save Shortcuts" subsection under Game Flow, after Auto-Save.
  3. When enhanced is off, a slot key saves or loads directly. When it is on, it opens the overlay on that slot, and the hold time comes from `saveHoldDuration` (replacing `HOLD_TO_SAVE_MS`).
  4. In the overlay, show each slot's shortcut label and replace the static text with an OverlayHints row of glyphs (K2): Tap to load, Hold to save with a ProgressRing driven by the hold progress, Saving..., and Cancel Esc.
  5. Add the exit animation.
  6. The slot-next and slot-prev functions may stay as an extra.

### G2. Pause overlay disconnect card differs from RotP (major)
- **RotP evidence:**
  - `src/views/GameLayer/sub-components/PauseLayer.tsx` shows the pause bars, or ControllerDisconnectOverlay.
  - `src/views/GameLayer/sub-components/ControllerDisconnectOverlay.tsx`: "Double-click here to resume", a Resume glyph hint and Switch-input-profile glyph hints. It has no button.
- **ChronoKi:** `src/views/PauseOverlay/PauseOverlay.tsx`. The card says "X is not connected. Reconnect it to continue, or resume anyway." and has a Resume Button, with no glyphs and no switch-profile hint.
- **Change:**
  1. Replace the Button with RotP's double-click-to-resume surface and the text "Double-click here to resume".
  2. Add the glyph hint row: Resume (the pause function's binding) and Switch input profile (profile-prev and profile-next bindings), using the glyph source from K2.
  3. Keep the device-name line.

### G3. Profile switcher overlay has no "Switch" glyph hint (minor)
- **RotP evidence:** `src/views/GameLayer/sub-components/ProfileSwitcherOverlay.tsx` shows a prev/next glyph hint labelled "Switch".
- **ChronoKi:** `src/views/ProfileSwitcherOverlay/ProfileSwitcherOverlay.tsx` has no hint.
- **Change:** add the same hint row (profile-prev and profile-next glyphs plus "Switch") using K2's glyphs.

---

## 4. Settings: Video

### P1. Enhancements page is missing; Belthasar mods are spread over Picture and Audio (major)
- **Requirement:** the plan's Options table lists an "Enhancements (new)" page: interpolation, scene adjustments, fill bottom lines, Steam margins, free sync, instant uploads.
- **RotP evidence (the structure to copy):** `src/screens/game/extras/bugfixes.settings.ts`, the Extras > "Bug Fixes" page built by `buildBugFixSection` with own-row rows.
- **ChronoKi:** the gates are scattered:
  - `src/screens/game/video/picture.settings.ts`: `sceneAdjust`, `wideSteamMargins` and `fillBottomLine` under Widescreen; `interpolate` and `freeSync` under Performance
  - `src/screens/game/gameplay/audio.settings.ts`: `instantUploads` under Timing
  - The extras group in `src/screens/screens.config.ts` is empty.
- **Change:**
  1. Add `src/screens/game/extras/enhancements.settings.ts` (title "Enhancements", icon 'sparkles', order 1, keywords enhancements, belthasar, interpolation, steam, free sync, uploads).
  2. Build it like `bugfixes.settings.ts`: one own-row gate per Belthasar mod, grouped as:
     - Motion: Frame Interpolation, Free Sync
     - Widescreen: Scene Adjustments, Steam Margins, Fill Bottom Lines
     - Sound: Instant Sound Uploads
  3. Remove those rows from Picture and Audio. Picture keeps the Widescreen gate and Aspect Ratio, Render Scale, and Show FPS (P2). Remove Audio's Timing section.
  4. Each gate keeps its feature registry entry and stays locked in original mode.

### P2. Show FPS is on Window, not on Picture > Performance (minor)
- **RotP evidence:** the Performance section in `src/screens/game/video/picture.settings.ts`: `displayPerfInTitle`, label "Show FPS", description "Display the current frames per second, and the refresh rate of your display, in the title bar while the game is running".
- **ChronoKi:** `src/screens/game/video/window.settings.ts` has `showFps` in the Window section.
- **Change:**
  1. Move `showFps` into Picture > Performance with RotP's label and description, and add 'fps' to the keywords.
  2. After P1, Performance holds only Show FPS (V-Sync is out of scope). That matches RotP minus V-Sync.

### P3. Window page has extra sections and rows (minor)
- **RotP evidence:** `src/screens/game/video/window.settings.ts` has one "Window" section: Start in Fullscreen, Viewport (Letterbox, Fit Window, Stretch), Pixel Perfect.
- **ChronoKi:** `src/screens/game/video/window.settings.ts` has three sections:
  - Window: windowMode, startFullscreen, showFps
  - Viewport: viewport, pixelPerfect, linearFiltering
  - Layout: Widget layout Reset. ChronoKi has no widgets, so this resets nothing.
- **Change:**
  1. Make one "Window" section with Start in Fullscreen, Viewport, Pixel Perfect and Linear Filtering (the gate; RotP's Pixel Perfect description mentions Linear Filtering).
  2. Drop the Layout section.
  3. Drop the Window mode row, or keep it only with a board decision saying why it beats RotP's Start in Fullscreen.
  4. Remove 'borderless' and 'widget layout' from the keywords if those rows go.

---

## 5. Settings: Audio

### A1. Audio page structure and wording (minor)
- **RotP evidence:** `src/screens/game/gameplay/audio.settings.ts`. The first section is "Volume", with "Master Volume" described as "Controls the overall game volume, so it affects all audio output". There is no enable-audio row; mute is the title-bar volume control.
- **ChronoKi:** `src/screens/game/gameplay/audio.settings.ts` has an "Output" section (`enableAudio` "Audio", "Master volume") and a "Timing" section (`instantUploads`).
- **Change:**
  1. Rename the section to "Volume" with the single row "Master Volume" and RotP's description (0 to 100, per S5).
  2. Drop the `enableAudio` row, since mute already lives in the title-bar volume (`masterMuted`). If `enableAudio` is still needed to switch the core's sound off, keep it with a board decision.
  3. Move `instantUploads` to Enhancements (P1).

---

## 6. Settings: Gameplay

Quick Save Shortcuts is covered in G1.

### GP1. Original mode is the first section; RotP puts its equivalent last (minor)
- **RotP evidence:** in `src/screens/game/gameplay/gameplay.settings.ts`, "Vanilla Safe" is the last section, with label "Vanilla Safe" and a single full-sentence description.
- **ChronoKi:** `src/screens/game/gameplay/gameplay.settings.ts` has the section "Mode" with label "Original mode" first.
- **Change:**
  1. Move the section to the end of `sections` and title it "Original Mode", with label "Original Mode".
  2. Use the description "Forces off every enhancement, so the game plays exactly as released. Your choices are kept for when you turn it off." and drop the long hint.

### GP2. Turbo speed range (minor)
- **RotP evidence:** `turboSpeed` runs 1.25x to 10x, with the description "How much faster the game runs while the shortcut is held, from 1.25x up to 10x." and the hint "Needs Turbo on."
- **ChronoKi:** `turboSpeed` runs 2 to 10, step 1.
- **Change:** if port-kit's speed accepts fractions, use RotP's steps (1.25, 1.5, 2 ... 10) and wording. If it does not, keep 2 to 10 and record a board decision.

---

## 7. Settings: Extras

The Enhancements page is covered in P1.

### E1. Haptics page (minor; needs a decision)
- **Requirement:** the plan's Options table keeps "rumble on/off and intensity".
- **RotP evidence:**
  - `src/screens/game/extras/haptics.settings.ts`, section "Vibration": "Enable Haptic Feedback" and "Vibration Intensity".
  - The rumble test is registered in `src/controller-report/controller-report.constants.ts` (`RUMBLE_TESTS`).
- **ChronoKi:** nothing (no haptics code at all).
- **Change:**
  - Without engine events there is nothing to rumble on except the device test. Either:
    - add `src/screens/game/extras/haptics.settings.ts` with the "Vibration" section (two rows, RotP's labels and descriptions, the description saying it applies to the controller test until game events exist) and register one rumble test ("Test Rumble") through `registerRumbleTests`, or
    - remove the line from the plan's Options table with a board decision.
  - Recommendation: the decision, since the rows are hollow without hooks.

### E2. Mobile page for the Android host (minor; deferred)
- **RotP evidence:** `src/screens/game/extras/mobile.settings.ts` (`hosts: ['capacitor']`, "Render under camera cutout").
- **ChronoKi:** none.
- **Change:** when the Android host lands, add the same page and `renderIntoNotch` row. It is not needed for the desktop build.

---

## 8. Settings: Contributing

### C1. Row labels do not match RotP (minor)
- **RotP evidence:** `src/screens/game/app/contributing.settings.ts`:
  - "Developer Mode" ("Turns on developer tools.")
  - "Allow debugging logs tracking" ("Keeps detailed logs and adds a titlebar capture button (Tab) and a floating button for sending a debug report.")
- **ChronoKi:** `src/screens/game/app/contributing.settings.ts` has "Developer tools" and "Debug logging".
- **Change:** use RotP's two labels. Use RotP's descriptions once S1 lands, with the capture key named as bound there.

---

## 9. Settings wording, all pages

### W1. Labels are sentence case and hints are long; RotP uses Title Case, one sentence and short hints (major)
- **RotP evidence:** every RotP settings file, for example:
  - "Start in Fullscreen", "Master Volume", "Max Auto-Save Entries", "Turbo Speed", "Show FPS", "Pixel Perfect"
  - descriptions are one sentence
  - hints are short dependency notes ("Needs Enable Auto-Save.", "Needs Turbo on.")
- **ChronoKi:**
  - `src/screens/game/**/*.settings.ts` uses "Start fullscreen", "Master volume", "Widescreen aspect", "Render scale", "Auto-save interval", "Max auto-save entries", "Turbo speed", "Window mode", "Developer tools".
  - The feature labels in `packages/features/src/feature-registry/core-features.constants.ts` (and the host feature constants beside it) are "Scene adjustments", "Fill bottom lines", "Frame interpolation (60+ fps)", "Internal resolution (2-4x)", "Free sync", "Instant sound uploads", "Linear filtering", "Save states", "Auto-save", "Save on quit".
  - `src/settings-controls/gate-items.ts` sets `hint = feature.userMessage`, which repeats the description for host features.
- **Change:**
  1. Title-case every settings label and feature label: "Scene Adjustments", "Fill Bottom Lines", "Frame Interpolation", "Render Scale", "Free Sync", "Instant Sound Uploads", "Linear Filtering", "Save States", "Enable Auto-Save", "Save on Quit", "Start in Fullscreen", "Aspect Ratio", "Auto-Save Interval", "Max Auto-Save Entries", "Turbo Speed". Keep ranges such as "(2-4x)" out of labels and put them in the description.
  2. Cut each description to one sentence.
  3. In `gateItem`, set `hint` only when `userMessage` differs from the description, and keep hints to a short "Needs X." line where a dependency exists. A lock cause stays a hint.

---

## 10. Controls

### K1. Function set lacks Reset and Fullscreen, and names Turbo "Fast Forward" (major)
- **RotP evidence:** `packages/features/src/controls/functions/functions.constants.ts` has pause, reset, fullscreen, turbo ("Turbo"), profile-next and profile-prev, plus the per-slot and capture functions (handled in G1 and S1).
- **ChronoKi:** `packages/input-mapping/src/functions/function-actions.constants.ts` has 'fast-forward' ("Fast Forward", Tab) and no reset or fullscreen.
- **Change:**
  1. Rename the label to "Turbo" and the id to `turbo`, with a binding migration from `fast-forward`, so it matches the Turbo feature and settings.
  2. Add `fullscreen` (F11, toggles the window) and `reset` (soft reset through the core, if port-kit exposes one; otherwise record the gap in a board decision).
  3. Keep `menu` and `screenshot` as extras.

### K2. No glyph source or InputGlyph (major)
- **RotP evidence:**
  - `src/controller-report/register-controller-hooks.ts` calls `registerGlyphSource(GLYPH_SOURCE)`, with controller-family icons (`src/input/controller-families/controller-icon-map.constants.ts`) and button icons (`src/input/button-icons/get-button-icon-url.ts`).
  - The InputGlyph compound under `src/input/controls/` is used by Controls, the overlays (G1 to G3) and the device cards.
- **ChronoKi:** no `registerGlyphSource` call and no InputGlyph (only `src/input/controls/ControlsSettings.tsx` and its panels).
- **Change:**
  1. Port the controller-family icon map, the button-icon URL helper and the InputGlyph compound. These are generic controller icons, not game art.
  2. Call `registerGlyphSource` from the shell module's start-up, without the Sanctuary report action.
  3. Use InputGlyph in G1, G2 and G3.

---

## 11. Data bucket

### D1. Data Home is missing (major, carried over from the earlier review)
- **RotP evidence:**
  - `src/screens/data/home.hero.tsx`: a compact hero with Eyebrow "Data", Title "Your library", the Action "Open data folder" (when `capabilities.revealDataFolder`), the Tool "Refresh", Facts from `dataHomeFacts(summary)`, and the `DataHome` body (sections plus storage details).
  - It uses `src/views/DataHome/` and `src/views/DataManager/sub-components/data-overview/useStorageSummary.ts`.
- **ChronoKi:** there is no `src/screens/data/home.hero.tsx`. The Data bucket opens straight on a page.
- **Change:**
  1. Add `src/screens/data/home.hero.tsx`, a copy of RotP's: same meta (title 'Home', icon 'house', keywords data, overview, disk, folder, total, library, `hero.size 'compact'`), slots and wording.
  2. Port `views/DataHome` (`DataHome`, `dataHomeFacts`), listing ChronoKi's domains: profiles, ROMs, assets, input, config, logs.
  3. Use the storage summary hook the Storage page already uses.
  4. Regenerate `.brock`.

### D2. Profile detail lacks the Settings tab and uses another Data tab name (major)
- **RotP evidence:** `src/views/DataManager/sub-components/profile-manager/profile-detail/profile-detail-tabs.constants.ts`:
  - The tabs are Overview, Settings and "Saves and play".
  - `ProfileSettingsTab.tsx` shows a read-only summary of the profile's settings by section, with the callout "Read only. Change these in Settings.", built from `settings-sections/*.constants.ts`.
- **ChronoKi:** `src/views/ProfileManager/ProfileManager.constants.ts` has the tabs Overview and "Data". `src/views/ProfileManager/sub-components/ProfileDetailPanel.tsx` has no settings tab.
- **Change:**
  1. Add a `settings` tab between Overview and Data, and rename "Data" to "Saves and play".
  2. Add `ProfileSettingsTab.tsx` plus a `settings-sections` constants folder for ChronoKi's pages: Picture, Window, Audio, Gameplay and Enhancements, listing key, label and format.
  3. Read the profile's settings file read-only, with the same callout and the empty text "No settings saved yet."

### D3. Creating a profile does not open it (major)
- **RotP evidence:** `src/screens/data/library/profiles.page.tsx`. After a successful create, `createProfile` selects the profile and calls `open('game')`.
- **ChronoKi:**
  - `src/views/ProfileManager/behavior/useProfileManager.ts`: `finishCreating` only selects the new row in the list.
  - `src/screens/data/library/profiles.page.tsx` gets no create callback.
- **Change:**
  1. Pass `onOpenProfile` into the wizard path.
  2. In `finishCreating`, look up the new profile and call `onOpenProfile(profile)`. That makes it active and opens `game`, as RotP does.

### D4. ROMs page file name, id and order (minor)
- **RotP evidence:** `src/screens/data/library/roms.page.tsx` (order 2) and `profiles.page.tsx` (order 1).
- **ChronoKi:** the ROMs page is `src/screens/data/library/library.page.tsx` (id `library`), and Profiles has order 0.
- **Change:**
  1. Rename the file to `roms.page.tsx` (route `data/library/roms`) and update any `nav.open` or route string that names the old id.
  2. Set Profiles to order 1.
  3. Regenerate `.brock`.

---

## Verdict

**FAIL.** There are no blockers, but 15 majors and 16 minors remain.

| Severity | Count | Findings |
|---|---|---|
| Blocker | 0 | none |
| Major | 15 | S1, S2, H1, H2, H3, H4, G1, G2, P1, W1, K1, K2, D1, D2, D3 |
| Minor | 16 | S3, S4, S5, H5, H6, H7, G3, P2, P3, A1, GP1, GP2, E1, E2, C1, D4 |

The fastest route to PASS is to work through the majors in this order:
1. S2, the one-line route fix.
2. D1, D3 and H1, which are small ports.
3. K2, then G1 and G2, which build on the glyphs.
4. P1 and W1, together.
5. H2, H3 and H4.
6. S1, D2 and K1.
