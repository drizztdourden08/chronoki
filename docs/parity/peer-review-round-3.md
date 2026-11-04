# Peer review, round 3: ChronoKi against RotP, screen by screen

Reviewer: an independent peer review, done by reading code only (no builds, tests or launches).
Date: 2026-11-04. The comparison is ChronoKi `main` at `ef892ba` (batch G, `a65dd98..ef892ba`) against RotP's `apps/desktop` in its current state.

Paths are relative to each repository root:
- RotP = `X:/relic-of-the-past`
- ChronoKi = `X:/chronoki`

Most app paths sit under `apps/desktop/src`, written below as `src/`.

Requirements used: `plans/chronoki-port.html`, `CLAUDE.md`, rounds 1 and 2 (`docs/parity/peer-review-round-1.md`, `peer-review-round-2.md`) and the lead decisions D-25 to D-30.

Out of scope as briefed, so not counted:
- Hookshop, Sanctuary and the Studios
- The ALttP-only parts (navigation, randomizer, HUD, game hooks, apworld, Zelda Gameplay/Dialog/Online pages, Camera and Graphics pages, Bugfixes, Sprites, Cheats tab, Modern Controls tab)
- Anything that needs engine hooks (Music/SFX split, V-Sync, MSU, audio device)

Accepted lead decisions:
- D-25: no Haptics or Mobile.
- D-26: no Window Mode or Enable Audio rows.
- D-27: turbo in fractional steps.
- D-28: SRAM import is locked while the game runs.
- D-30: the restart toast and the lock jump are ported.
- Plain wording where ChronoKi's lint bans "Enhanced" in settings prose ("Hold Save for Slot Picker").

## 1. Round 2 status

| ID | Status | Evidence (ChronoKi unless marked RotP) |
|---|---|---|
| R2-S6 | Resolved | `src/settings-effects/warn-restart-needed.ts:7-11` has RotP's toast (same text, danger, `duration: 0`, id `restart-required`). `is-restart-key.ts:6-9` flags `live: false` features, their option keys (`settings-controls/gate-keys.constants.ts:4-11`) and `original`. It runs from `views/GameSession/behavior/useRestartWarning.ts:14-18`, hooked in at `useGameSessionValue.ts:67`. The dismissal timing differs from RotP: see R3-S8. |
| R2-S7 | Resolved | `packages/design/src/lock-overlay/LockOverlay.constants.ts:3` reads "Disabled in Original Mode". `src/settings-controls/lock-overlay.tsx:8-11` passes `onOpenSettings` for `vanillaSafe`. `settings-nav/open-setting.ts:6-10` resolves the anchor `original`: the brock row seed uses `anchor: row.key`, and the row is in `.brock/search.ts` (gameplay `mode` section). |
| R2-K3 | Resolved (minor gaps below) | Both panels are SidePanels: `ProfilesPanel.tsx:9-33` (`controls:profiles-width`) and `DevicesPanel.tsx:13-28` (rescan button, `DeviceRow`, `DeviceIcon`, "No devices detected"). `BindingListHeader.tsx:5-15` and `BindingRow.tsx:28-37` add glyphs. `FunctionBindingsTab.tsx:19-32` has the "Keyboard Shortcuts" header and the reserved "Open Menu / Esc" row. `controls.constants.ts:13-17` has three tabs, and `OptionsTab.tsx:13` is "Required inputs". What is left is R3-K5, R3-K6 and R3-K7. |
| R2-K4 | Resolved | `src/screens/game/gameplay/controls.custom.tsx:11` matches RotP. |
| R2-G4 | Partly | The subsection is `save-shortcuts` "Quick Save Shortcuts", placed after Auto-Save (`gameplay.settings.ts:46-61`). `useCancelOnOtherInput.ts` ports RotP's hook. The "hints only when highlighted" part has no effect: see R3-G5. |
| R2-P4 | Resolved | `src/screens/game/video/window.settings.ts:9,21,26,34` and `gameplay.settings.ts:31,39,55` are RotP's text word for word. |
| R2-GP3 | Resolved | `gameplay.settings.ts:34` is a range of 60 to 1800, step 60, `asMinutes`. `AutoSaveIntervalControl` and its constants are deleted, and so is the line in `render-setting-control.tsx`. |
| R2-D5 | Resolved | `src/views/ProfileManager/ProfileManager.constants.ts:17` is `enhanced: 'Enhanced'`. A search keyword was left behind: see R3-D6. |
| C1 | Resolved | `src/screens/game/app/contributing.settings.ts:26` carries the fixed text. |

**Regression check of batch G:**
- **Gating:** no regression found. `featureIdOf` and `lockCauseOf` are unchanged, and the new `save-shortcuts` rows keep their gates and `OPTION_KEY_FEATURE` mappings.
- **Wording:** the `.brock/search.ts` regen matches the sources.
- **Behaviour:** one regression, R3-K5. The Shortcuts tab now filters out `screenshot`, which is still bound to F12.

## 2. New findings

### R3-K5. The Shortcuts tab hides bound ChronoKi functions (minor, batch G regression)
- **RotP:**
  - `packages/features/src/controls/functions/functions.constants.ts:4-16`: SHORTCUT_ACTIONS is RotP's full function set (minus cheats), so every function RotP has is listed.
- **ChronoKi:**
  - `src/input/controls/controls.constants.ts:21-32` copies RotP's list.
  - `FunctionBindingsTab.tsx:13-16` shows only that list.
  - So `screenshot` (default F12, `packages/input-mapping/src/functions/function-actions.constants.ts:47`, handled at `src/views/GameSession/behavior/function-handlers.constants.ts:24`) is still active but can no longer be seen, rebound or cleared. The search entry at `controls.custom.tsx:11` still offers "screenshot".
  - `save-state`, `load-state`, `slot-next` and `slot-prev` (`function-actions.constants.ts:6-9`, default none) are now impossible to bind. They are dead, except as the fallback in `slot-function-of.ts:7`.
- **Fix:**
  1. Append `'screenshot'` to SHORTCUT_ACTIONS, after `toggle-debug-capture`.
  2. Either list the four generic slot actions after the per-slot ones, or drop them from `BASE_ACTIONS` and their handlers. Keep `save-state` only as an internal fallback id.

### R3-K6. Game Controls rows: wrong column content and no device icon (minor)
- **RotP:**
  - `src/views/ProfileHub/sub-components/controls/SnesBindingRow.tsx:14-16`: the Action column is the game action (`SNES_ACTION_LABELS`, for example "Interact"), and the SNES column is `SNES_BUTTON_LABELS` ("A Button") plus the glyph.
  - `BindingRow.tsx:47-51` adds the icon of the device the binding came from.
- **ChronoKi:**
  - `src/input/controls/SnesBindingsTab.tsx:19-20`: the Action column shows "A Button" and the SNES column shows the raw id "A", so the two columns repeat each other.
  - No device icon slot.
- **Fix:**
  1. Put `SNES_BUTTON_LABELS` in the SNES column.
  2. Give the Action column ChronoKi's own field labels for the default layout. For example: A "Confirm / Talk", B "Cancel / Run", X "Menu", Start "Pause", the D-pad "Move Up/Down/Left/Right". Keep the button name for buttons with no fixed field role.
  3. Add the `deviceIconUrl` slot from the binding's `vid:pid`.

### R3-K7. The Controls side panels fold to an empty rail; device status wording (minor)
- **RotP:**
  - `ControlsProfiles.tsx:14-17,41`: Profiles is folded by default (`useStoredFold(PROFILES_FOLD_KEY, true)`), folds when narrow, and its rail shows a profile button for each profile.
  - `ControlsDevices.tsx:18,43`: Devices does the same with `DeviceRailButton`.
  - `controller-group-entry.ts:11-16` and `keyboard-entry.ts:13` give the meta "Ready", "Ready, USB" or "Unavailable".
- **ChronoKi:**
  - `ProfilesPanel.tsx:9-33` and `DevicesPanel.tsx:13-28` pass no `railItems`, `collapsed` or narrow handling. Tessera's own fold works, but the folded rail is empty and Profiles starts unfolded.
  - `DeviceRow.tsx:17` says "Connected" / "Not connected".
- **Judgement on the accepted Devices simplification:**
  - Dropping controller grouping only matters for multi-port adapters.
  - Dropping drag-to-assign loses nothing, because a click does the same assign.
  - So neither is a real gap. The empty folded rail and the status wording are user-visible.
- **Fix:**
  1. Pass `railItems`: a profile button per profile, and a `DeviceIcon` button per device that calls `onAssign`.
  2. Fold Profiles by default, and fold both panels when narrow.
  3. Set the meta to "Ready" (plus the bus, when known) or "Unavailable".

### R3-G5. Save State Overlay: hints and cancel-on-input also apply on the menu/title-bar open (minor, rest of R2-G4)
- **RotP:**
  - `src/views/SaveStateOverlay/behavior/useEnhancedSaveSlot.ts:18,44`: `highlightedSlot` is `null` unless the overlay was opened by the slot shortcut, and `useCancelOnOtherInput` is bound only to that shortcut's own `open`.
  - The title-bar / menu toggle (`views/GameSession/behavior/useSaveOverlay.ts:7,12`) therefore opens with no highlight and no hints (`SaveStateOverlay.tsx:22,56`), and other input does not close it.
- **ChronoKi:**
  - `src/views/GameSession/behavior/toggle-save-overlay.ts:13` opens with `currentSlot()` highlighted, and `slot` is always a number (`src/game/save-overlay/save-overlay.constants.ts:10`). So `SaveStateOverlay.tsx:57` (`highlighted >= 0`) is always true, and the hints always show.
  - `SaveStateOverlay.tsx:25` cancels on other input for every open.
- **Fix:**
  1. Add `highlighted: number | null` (or a `viaShortcut` flag) to the overlay store, and pass `null` from `toggleSaveOverlay`.
  2. Render the hints and run `useCancelOnOtherInput` only when it is set.

### R3-S8. The restart toast stays up after the game stops (minor)
- **RotP:** `src/views/GameSession/behavior/useSettingsBridge.ts:64-66` resets the flag and dismisses `restart-required` when the game goes from running to stopped.
- **ChronoKi:** `src/views/GameSession/behavior/useRestartWarning.ts:20-23` dismisses only when `launchId` changes, so the sticky (`duration: 0`) toast stays on Home after Stop until the next Play.
- **Fix:** dismiss and reset when `running` goes from true to false, keeping a was-running ref as RotP does. The `launchId` effect can then go.

### R3-W2. Gate and row descriptions still differ from RotP (minor, cosmetic)
- **RotP:** `src/screens/game/gameplay/gameplay.settings.ts`:
  - `:21` autoSaveEnabled: "Automatically create save state snapshots at regular intervals during gameplay".
  - `:24` saveOnQuit: "Automatically create a save state when you stop the game or close the app".
  - `:31` "...instead of immediately saving/loading".
  - `:39` turbo: "Runs the game faster while the Turbo shortcut is held. ..."
- **RotP:** `src/screens/game/video/graphics.settings.ts:24` linearFiltering: "Apply bilinear interpolation for smoother, less pixelated visuals. Turn it off for crisp pixel art", with the hint "Pixel Perfect turns it off."
- **RotP:** Show FPS and Master Volume end without a period (`picture.settings.ts:33`, `audio.settings.ts:16`).
- **ChronoKi:**
  - `packages/features/src/feature-registry/host-features.constants.ts:6,11,22,27,32` have the shorter texts ("Runs the game faster while a key is held.", "Smooths the picture instead of sharp pixels.", "...immediately saving.", "Saves a state on its own at a set interval.", "Saves a state when you leave the game.").
  - `src/screens/game/video/picture.settings.ts:53` and `gameplay/audio.settings.ts:16` end with ".".
- **Fix:**
  1. Copy RotP's descriptions into `description` and `userMessage`. Leave out "Music keeps its tempo." unless it is true for the engine. Use "Pixel Perfect turns it off." as the Linear Filtering `userMessage`, so that `gateItem` shows it as the hint.
  2. Drop the two trailing periods.

### R3-D6. Profiles wording leftovers (minor, cosmetic)
- **RotP:**
  - `src/views/DataManager/sub-components/profile-manager/ProfileCreateWizard/ProfileCreateWizard.constants.ts:32,34` has "Give the profile a name." and "Pick a ROM."
- **ChronoKi:**
  - `src/screens/data/library/profiles.page.tsx:8` still has the keyword `'modified'`, while the label is now "Enhanced".
  - `src/views/ProfileManager/sub-components/ProfileCreateWizard/ProfileCreateWizard.constants.ts:9-10` reads "Enter a name for the profile." and "Choose a ROM. Add one in the Library first if the list is empty."
- **Fix:** change the keyword to `'enhanced'` and use RotP's two error strings.

### R3-C2. Credits nav icon differs (minor, cosmetic)
- **RotP:** `src/screens/credits.card.tsx:5` has `icon: 'trophy'` and the keyword `contributors`.
- **ChronoKi:** `src/screens/credits.card.tsx:5` has `icon: 'file-text'`, and the keyword list lacks `contributors`.
- **Fix:** use `'trophy'` and RotP's keywords (keeping `'font'`).

## Checked, not counted

- **Tab name:** "Game Controls" instead of RotP's "Vanilla Controls". RotP names the tab after a control scheme, and ChronoKi has only one scheme. Accepted.
- **Required inputs:** `required-input-rows.ts` and `RequiredInputState.tsx` match RotP. The row id adds the label so that it is unique per pad, which is harmless.
- **Cancel on other input:** `useCancelOnOtherInput.ts` matches RotP. The mappings are read once at open rather than on each key, which makes no difference while the overlay is open.
- **Title bar:** `src/title-bar/*.action.ts` (volume, Save States, FPS, refresh rate; orders 1 to 4) matches RotP. So does the shell menu (`src/shell/chronoki-menu.constants.ts`).
- **Data screens:** the Storage, Data home and ROMs pages are the same as RotP's apart from import paths.
- **Original Mode and turbo:** Original Mode locks turbo and the slot picker (`affectsVanillaParity: true`), and leaves save states, auto-save and save on quit alone. This fits the requirement that every enhancement is gated.

## Verdict

| Severity | Open | Findings |
|---|---|---|
| Major | 0 | none |
| Minor | 8 | R3-K5 (regression), R3-K6, R3-K7, R3-G5 (R2-G4), R3-S8, R3-W2, R3-D6, R3-C2 |

Round 2: 8 of 9 resolved, 1 partly done (R2-G4 is now R3-G5).

Both majors are closed. Four minors are behaviour, not cosmetics:
- R3-K5: a bound key that cannot be rebound
- R3-G5: hints and cancel on every open
- R3-S8: the toast stays after Stop
- R3-K6: the Action column on the main Controls tab

Verdict: FAIL (0 major, 8 minor open)
