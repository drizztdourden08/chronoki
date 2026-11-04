# Peer review, round 2: ChronoKi against RotP, screen by screen

Reviewer: an independent peer review, done by reading code only (no builds, tests or launches).
Date: 2026-11-04. The comparison is ChronoKi `main` at `39c9567` against RotP's `apps/desktop` in its current state.

Paths are relative to each repository root:
- RotP = `X:/relic-of-the-past`
- ChronoKi = `X:/chronoki`

Most app paths sit under `apps/desktop/src`, written below as `src/`.

Requirements used: `plans/chronoki-port.html`, `CLAUDE.md`, round 1 (`docs/parity/peer-review-round-1.md`) and the lead decisions D-25 to D-29.

Out of scope as briefed, so not counted:
- Hookshop, Sanctuary and the Studios
- The ALttP-only parts (navigation, randomizer, HUD, game hooks, apworld, Zelda Gameplay/Dialog/Online pages, Camera and Graphics pages)
- Anything that needs engine hooks (Music/SFX split, V-Sync, MSU)

Accepted lead decisions: D-25 (no Haptics or Mobile), D-26 (no Window Mode or Enable Audio rows), D-27 (turbo 1.25x to 10x), D-28 (SRAM import locked while running), the label "Hold Save for Slot Picker", and the hidden-launch pass.

**D-29 was checked and is partly wrong:**
- The APP > Display nav item comes from the Brock display module in both apps. That part is the same.
- RotP **does** show a restart hint. See R2-S6.
- RotP's lock overlay uses different wording and has a jump to the setting. See R2-S7.

## 1. Round 1 status

| ID | Status | Evidence (ChronoKi unless marked RotP) |
|---|---|---|
| S1 | Resolved | `src/main.tsx:41` `bugReport={chronokiBugReport}`; `src/bug-report/chronoki-bug-report.ts:5` has a recordings section; DebugFloatingControls is rendered from GameView; `toggle-debug-capture` is bound to Backquote at `packages/input-mapping/src/functions/function-actions.constants.ts:51`; logs domain text at `src/storage/data-domains.constants.ts:9`. Capture is app-side only, so RotP's `app-debug-capture` stream scheme is not needed. |
| S2 | Resolved | `src/title-bar/useFrameRateTitleBarItem.ts:10` and `useRefreshRateTitleBarItem.ts:11` both open `game/picture` (RotP's stale `game/display` was not copied). |
| S3 | Resolved | `apps/desktop/brock.config.ts:12` copyright, `:17` wordmark. |
| S4 | Resolved | `src/main.tsx:42` `withOwnRowTabs(screenTree)`. |
| S5 | Resolved | `src/main.constants.ts:8` `max: 100`, plus `useVolumeScaleMigration`. |
| H1 | Resolved | `src/views/HomeTab/HomeTab.tsx:12-21`: left is Quick Saves then Play Sessions; right is Saves then Auto-saves. |
| H2 | Resolved | `src/views/HomeTab/behavior/ensure-game-running.ts`, called at `useQuickSaves.ts:24,38`, `useNormalSaves.ts:27` and `useAutoSaves.ts:16`; the hero tile uses `normal.load` (`src/screens/game/home.hero.tsx:46`). |
| H3 | Resolved (D-28) | `packages/game-core/src/save-file/valid-sram-slots.ts`; "Verified: N of 3" at `src/views/HomeTab/dialogs/ImportSramDialog.tsx:34` and `UnverifiedSramDialog.tsx:20`; the lock at `home.hero.tsx:71`. |
| H4 | Resolved | `src/compounds/ProfileHero/sub-components/HeroProgress.tsx:7-22` (File, lead, level, play time, empty text); rendered at `home.hero.tsx:75`. |
| H5 | Resolved | `src/game/auto-save/write-auto-state.ts:8` stores the trigger as a name prefix; `src/views/HomeTab/behavior/auto-trigger-label.ts:4-9` maps it to RotP's labels (`HomeTab.constants.ts:30`). |
| H6 | Resolved | `src/views/HomeTab/HomeTab.css:48-56` (border, dividers, max-height 360, scroll); `HomeTab.constants.ts:34` limit 20. |
| H7 | Resolved | `home.hero.tsx:15` keywords; `:50` returns null without a profile. |
| G1 | Partly | Slot functions, settings, overlay labels, glyph hints and exit animation landed. Still open (minor, below): the subsection title and order, hints shown at all times, and no cancel-on-other-input. |
| G2 | Resolved | `src/views/PauseOverlay/PauseOverlay.tsx:28-54` has RotP's text and glyph hints. |
| G3 | Resolved | `src/views/ProfileSwitcherOverlay/ProfileSwitcherOverlay.tsx:87-93`. |
| P1 | Resolved | `src/screens/game/extras/enhancements.settings.ts` has Motion, Widescreen and Sound. |
| P2 | Resolved | `src/screens/game/video/picture.settings.ts:47-55` Show FPS, with RotP's text. |
| P3 | Resolved | `src/screens/game/video/window.settings.ts:18-37` is one Window section. The wording left over is R2-P4. |
| A1 | Resolved | `src/screens/game/gameplay/audio.settings.ts:13-17` Master Volume 0 to 100, step 5. |
| GP1 | Resolved | `gameplay.settings.ts:75-85` ends with "Original Mode". |
| GP2 | Resolved (D-27) | turbo description and hint match RotP. |
| E1, E2 | Closed (D-25) | none |
| C1 | Partly | The labels match. `src/screens/game/app/contributing.settings.ts:26` still says "Keeps detailed logs to help when you report a bug." RotP `contributing.settings.ts:27` names the capture key and the floating report button. Fix: "Keeps detailed logs and adds a capture key (`) and a floating button for sending a debug report." |
| W1 | Resolved | Labels are Title Case; `src/settings-controls/gate-items.ts:6-10` hints only when the text differs. Leftover descriptions are folded into R2-P4. |
| K1 | Resolved | `function-actions.constants.ts:5-55` has turbo, reset, fullscreen F11, menu and screenshot F12. |
| K2 | Partly | `src/boot/glyph-source.task.ts` and `src/compounds/InputGlyph` exist and are used by the overlays. Controls and device rows still use no glyphs; this is tracked in R2-K3. |
| D1 | Resolved | `src/screens/data/home.hero.tsx` matches RotP's apart from the import path; `src/views/DataHome/` is in place. |
| D2 | Resolved | `src/views/ProfileManager/ProfileManager.constants.ts:9-13` has Overview, Settings and "Saves and play"; `sub-components/ProfileSettingsTab.tsx:13,16` has the empty text and the callout. |
| D3 | Resolved | `src/views/ProfileManager/behavior/useProfileManager.ts:31-35` calls `onOpenProfile`. |
| D4 | Resolved | `src/screens/data/library/roms.page.tsx:5` order 2; `profiles.page.tsx:8` order 1. |

## 2. New findings

### R2-S6. No restart warning when a non-live setting changes mid-game (major)
- **RotP:**
  - `src/settings-effects/warn-restart-needed.ts:7-18` shows the toast "Some changes require a game restart to take effect" (danger, `duration: 0`, id `restart-required`) when a key outside `LIVE_SETTINGS` changes.
  - It is called from `src/settings-effects/apply-settings-effects.ts:22`.
  - It is dismissed on restart at `src/views/GameSession/behavior/useSettingsBridge.ts:66`.
- **ChronoKi:**
  - There is no restart toast; "restart" appears nowhere in `src/`.
  - The core features are `live: false` (`packages/features/src/feature-registry/core-features.constants.ts:18,32,47`).
  - The ini is built once at boot: `src/views/GameLayer/behavior/useGameBoot.ts:21-23` is guarded by `launch.id`.
  - So toggling an Enhancements gate or Render Scale mid-game silently does nothing until the next start. This contradicts the D-29 claim that RotP shows no restart hint.
- **Fix:**
  1. Add `src/settings-effects/` with `warn-restart-needed.ts` and `apply-settings-effects.ts`, copied from RotP. A changed key is non-live when its feature (`OPTION_KEY_FEATURE` or `gate:<id>`) has `live: false`.
  2. Call it from the GameSession settings bridge while the game runs.
  3. Dismiss the toast on start.

### R2-S7. Lock overlay wording and the missing jump to Original Mode (minor)
- **RotP:**
  - `src/settings-controls/disabled-setting-messages.constants.ts:3` reads "Disabled in Vanilla Safe mode".
  - `src/settings-controls/lock-overlay.ts:9,17` passes `onOpenSettings` for the `vanillaSafe` cause, which opens that setting through `settings-nav/open-setting.ts`.
- **ChronoKi:** `packages/design/src/lock-overlay/LockOverlay.constants.ts:3` reads "Off in Original mode", and `src/settings-controls/lock-overlay.tsx` passes no `onOpenSettings`.
- **Fix:**
  1. Change the text to "Disabled in Original Mode".
  2. Pass `onOpenSettings` for the `vanillaSafe` cause, opening `game/gameplay` at the `original` row (port `settings-nav/open-setting.ts`).

### R2-K3. The Controls page structure differs from RotP (major)
- **RotP** (`src/views/ProfileHub/sub-components/controls/`):
  - `ControlsProfiles.tsx:39` is a collapsible, resizable Tessera SidePanel (`storageKey 'controls:profiles-width'`).
  - `ControlsDevices.tsx:41,53` is a "Devices" SidePanel with a rescan button, `DeviceRow` and `DeviceIcon`, and the EmptyState "No devices detected".
  - `BindingListHeader.tsx:5` shows the Action, SNES and Binding columns.
  - `BindingRow.tsx` shows button and device glyph images.
  - `ShortcutsTab.tsx:12-16` has the header "Keyboard Shortcuts" and a reserved "Open Menu / Esc" row, and filters `SHORTCUT_ACTIONS`.
  - `ControlsMain.tsx:14-18` has a third tab, Options.
  - `OptionsTab.tsx:16-18` has "Required inputs"; its Haptics section is out per D-25.
- **ChronoKi** (`src/input/controls/`):
  - `ProfilesPanel.tsx:7-8` and `DevicesPanel.tsx:16-23` are plain boxes. Devices use text-only `ListItemRow` rows with "New profile" and "Reset current to defaults" buttons, and have no icon, no rescan and no empty state.
  - `BindingRow.tsx` is text only, with no list header.
  - `FunctionBindingsTab.tsx:9` lists every mapping, with `menu` rebindable.
  - `controls.constants.ts:10-13` has two tabs.
- **Fix:**
  1. Port ControlsProfiles and ControlsDevices as SidePanels, with DeviceRow, DeviceIcon, the rescan button and the empty state.
  2. Port BindingListHeader and the glyph BindingRow, using `InputGlyph` and the K2 icons.
  3. In ShortcutsTab, add the header, the reserved Esc row and RotP's action order.
  4. Add an Options tab with "Required inputs" only.

### R2-K4. Controls search entry still says "fast forward" (minor)
- **RotP:** `src/screens/game/gameplay/controls.custom.tsx:12` reads "App shortcuts such as quick save and Turbo", with the keywords turbo and fullscreen.
- **ChronoKi:** `src/screens/game/gameplay/controls.custom.tsx:11` has the keyword 'fast forward' and the text "App shortcuts such as save state and fast forward".
- **Fix:** use RotP's label, description and keywords.

### R2-G4. Quick Save Shortcuts subsection and overlay behaviour (minor, the rest of G1)
- **RotP:**
  - `src/screens/game/gameplay/gameplay.settings.ts:17-37` orders Auto-Save, then "Quick Save Shortcuts" (id `save-shortcuts`), then Turbo.
  - `src/views/SaveStateOverlay/SaveStateOverlay.tsx:22,56` shows hints only when a slot is highlighted.
  - `src/views/SaveStateOverlay/behavior/useCancelOnOtherInput.ts` closes the overlay on any other input.
- **ChronoKi:**
  - `gameplay.settings.ts:20-35` puts a "Save States" subsection (id `save-states`) first.
  - `src/views/SaveStateOverlay/SaveStateOverlay.tsx:54` always renders the hints.
  - There is no cancel-on-other-input.
- **Fix:**
  1. Move the two rows into a "Quick Save Shortcuts" subsection (id `save-shortcuts`) after Auto-Save. `gateItem('saveStates')` can stay first in Game Flow.
  2. Render OverlayHints only when `highlighted != null`.
  3. Port `useCancelOnOtherInput`.

### R2-P4. Window and Auto-Save wording differs from RotP (minor)
- **RotP:**
  - `src/screens/game/video/window.settings.ts:8,17-19`
  - `src/screens/game/gameplay/gameplay.settings.ts:21-24`
- **ChronoKi:**
  - `src/screens/game/video/window.settings.ts:9,21,26,34`: "Opens the app in fullscreen the next time it starts.", "How the picture relates to the window.", another Fit Window hint and a shortened Pixel Perfect description.
  - `gameplay.settings.ts:45,51`: "How often a state is saved on its own.", and the Max Entries text plus an extra hint.
- **Fix:** copy RotP's descriptions and hints word for word, keeping Chrono Trigger-neutral nouns. "Original Mode always uses Letterbox." may stay as ChronoKi's own lock hint.

### R2-GP3. Auto-Save Interval control differs (minor)
- **RotP:** `src/screens/game/gameplay/gameplay.settings.ts:22` is a range of 60 to 1800, step 60, `asMinutes`.
- **ChronoKi:** `gameplay.settings.ts:42-47` has no control. `src/settings-controls/render-setting-control.tsx:16` swaps in `AutoSaveIntervalControl.tsx:7`, a SegmentedControl of presets.
- **Fix:** use RotP's range control, then delete `AutoSaveIntervalControl` and its options constants.

### R2-D5. Profile manager labels enhanced profiles "Modified" (minor)
- **RotP:** `src/views/DataManager/sub-components/profile-manager/ProfileCreateWizard/ProfileCreateWizard.constants.ts:28` uses "Enhanced".
- **ChronoKi:** `src/views/ProfileManager/ProfileManager.constants.ts:17` has `enhanced: 'Modified'`, shown in the detail pill and the wizard summary. The Home hero says "Enhanced" (`src/views/HomeTab/HomeTab.constants.ts:40`).
- **Fix:** set the label to `'Enhanced'`.

## Checked, not counted

- **Folder layout:** RotP uses `views/ProfileHub/sub-components/home-tab/*` and `views/GameLayer/sub-components/*`, and keeps its title-bar hooks in `src/hooks/`. ChronoKi uses `views/HomeTab`, `views/PauseOverlay` and `src/title-bar/`. Not visible to the user, and the behaviour matches.
- **Original Mode locks:**
  - Viewport is locked in Original Mode (`src/settings-controls/is-setting-disabled.ts:6`); RotP does not lock it. This follows the earlier `scaleStretch` gate and the forced Letterbox, so it is accepted.
  - The Pixel Perfect lock follows from the Viewport lock (RotP `display/is-display-disabled.ts:7`, same rule).
- **Settings normalise:** RotP's `SETTINGS.normalise/transformPatch` (`src/main.constants.ts:10-15`) serve RotP-only keys, so ChronoKi does not need them.
- **Credits:** `src/views/CreditsPage` matches RotP's CreditsTab.

## Verdict

| Severity | Open | Findings |
|---|---|---|
| Major | 2 | R2-S6, R2-K3 |
| Minor | 7 | C1, R2-S7, R2-K4, R2-G4 (G1), R2-P4, R2-GP3, R2-D5 |

Round 1: 28 of 31 resolved or closed, 3 partly done (G1 is now R2-G4, K2 is now R2-K3, and C1).

Verdict: FAIL (2 major, 7 minor open)
