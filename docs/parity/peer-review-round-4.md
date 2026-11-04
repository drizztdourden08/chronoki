# Peer review, round 4: ChronoKi against RotP, screen by screen

Reviewer: an independent peer review, done by reading code only (no builds, tests or launches).
Date: 2026-11-04. The comparison is ChronoKi `main` at `d341eb6` (batch H, `488a51e..d341eb6`) against RotP's `apps/desktop` in its current state.

Paths are relative to each repository root:
- RotP = `X:/relic-of-the-past`
- ChronoKi = `X:/chronoki`

Most app paths sit under `apps/desktop/src`, written below as `src/`.

Requirements used: `plans/chronoki-port.html`, `CLAUDE.md`, rounds 1 to 3 (`docs/parity/peer-review-round-1.md` to `peer-review-round-3.md`) and the lead decisions below.

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
- Plain "Hold Save for Slot Picker" wording, because the lint bans "Enhanced" in settings prose.
- Plain SNES button names (Y Button, L Button, R Button, Start Button, Select Button) as action labels where Chrono Trigger has no fixed action. A/B/X carry CT meanings: Confirm / Talk, Cancel / Run, Menu.

## 1. Round 3 status

| ID | Status | Evidence (ChronoKi unless marked RotP) |
|---|---|---|
| R3-K5 | Fixed | `src/input/controls/controls.constants.ts:28` lists `save-state`, `load-state`, `slot-next`, `slot-prev` after the per-slot actions, and `:32` appends `screenshot`. Labels exist (`packages/input-mapping/src/functions/function-actions.constants.ts:23-37`) and so do handlers (`src/views/GameSession/behavior/function-handlers.constants.ts:19-24`). |
| R3-K6 | Partly | The columns are fixed: `SnesBindingsTab.tsx:20-21` puts `SNES_ACTION_LABELS` (`controls.constants.ts:35-39`) in Action and `SNES_BUTTON_LABELS` in the SNES column. The device icon slot exists (`BindingRow.tsx:38-40`), but it shows on every row: see R4-K9. |
| R3-K7 | Partly | Rails are passed (`ProfilesPanel.tsx:18-29`, `DevicesPanel.tsx:23-25`, `DeviceRailButton.tsx:9-15`), Profiles starts folded (`controls.constants.ts:42`), both panels fold when narrow (`useFoldWhenNarrow.ts:5-13`), and the meta reads "Ready" / "Unavailable" (`DeviceRow.tsx:17`). Left over: R4-K8 (a batch H regression) and R4-K10. |
| R3-G5 | Fixed | `toggle-save-overlay.ts:12` opens with `null`. The store type is `number \| null` (`save-overlay.type.ts:4`, `save-overlay.constants.ts:10`). `SaveStateOverlay.tsx:25` cancels on other input only when a slot is highlighted, and `:57` shows hints only then. The shortcut path still highlights (`press-save-key.ts:15`, `step-slot.ts:8`). |
| R3-S8 | Fixed | `useRestartWarning.ts:26-32` resets the flag and dismisses `restart-required` when `running` goes from true to false, as RotP's `useSettingsBridge.ts:64-67` does. |
| R3-W2 | Fixed | `packages/features/src/feature-registry/host-features.constants.ts:6-34` carries RotP's texts. Linear Filtering's `userMessage` is "Pixel Perfect turns it off.", so `gateItem` shows it as the hint (`src/settings-controls/gate-items.ts:9-10`). The trailing periods are gone (`picture.settings.ts:53`, `audio.settings.ts:16`). |
| R3-D6 | Fixed | `profiles.page.tsx:8` has the keyword `'enhanced'`. `ProfileCreateWizard.constants.ts:9-10` reads "Give the profile a name." and "Pick a ROM." |
| R3-C2 | Fixed | `credits.card.tsx:5` has `icon: 'trophy'` and the keyword `contributors`. The search index is regenerated (`.brock/search.ts`). |

**Regression check of batch H:**
- **Gating:** no regression found. Batch H adds no feature. `featureIdOf`, `lockCauseOf` and the Original Mode locks are unchanged.
- **Stack rules:** no new dependency, no SDL, no vendored engine, nothing outside `src/`, `packages/features` and the search index.
- **Behaviour:** one regression, R4-K8. Folding Profiles by default hides the new profile's name field.

## 2. New findings

### R4-K8. "New profile" on the folded Profiles rail does not unfold the panel (minor, batch H regression)
- **RotP:** `src/views/ProfileHub/sub-components/controls/ControlsProfiles.tsx:20-23`: `handleAdd` calls `expand()` and then `handleCreate()`, so the new profile's inline name field is visible.
- **ChronoKi:**
  - Tessera's SidePanel shows `action` on the rail when it is folded (`tessera/src/composites/SidePanel/sub-components/SidePanelPane.tsx:15`).
  - `src/input/controls/ProfilesPanel.tsx:31` wires that button straight to `ctrl.create`. Profiles is now folded by default (`controls.constants.ts:42`), so a click from the rail creates a profile whose `startEditing` name field (`ProfilesPanel.tsx:42`, `ProfileItem.tsx:9,35-38`) sits in the inert, hidden body.
- **Fix:** wrap the action as `() => { setCollapsed(false); ctrl.create(); }`, as RotP's `handleAdd` does.

### R4-K9. The binding device icon shows on every row (minor, rest of R3-K6)
- **RotP:**
  - `src/views/ProfileHub/sub-components/controls-settings/button-display-mapping.ts:7-9`: a keyboard or empty binding gets no device icon.
  - `gamepad-display-mapping.ts:11,13`: a pad binding gets one only when it has a vid:pid and the profile uses more than one controller (`useDisplayMappings.ts:12`, `useDisplayFunctionMappings.ts:10`).
  - The icon sits before the binding label (`controls/BindingRow.tsx:47-51`).
- **ChronoKi:**
  - `src/input/controls/binding-device-icon.ts:13-16` returns the keyboard icon for every keyboard binding and the generic icon for any pad binding with no match.
  - So every row of a keyboard profile, on both tabs (`SnesBindingsTab.tsx:25`, `FunctionBindingsTab.tsx:40`), repeats a keyboard icon. The slot also sits after the label (`BindingRow.tsx:35-40`).
- **Fix:** return `undefined` unless the binding is a pad binding with `sourceVid`/`sourcePid` and `allowedDevices(profile).gamepadKeys.size > 1` (the helper already exists in `packages/input-mapping/src/runtime/profile-devices/allowed-devices.ts`). Move the slot before the label.

### R4-K10. The fold state is not remembered, and the narrow layout differs (minor)
- **RotP:**
  - `src/hooks/useStoredFold.ts:8-13` reads and writes each panel's fold (`controls.constants.ts:79-80`, `controls.profiles.collapsed` and `controls.devices.collapsed`), so a panel the player unfolds stays unfolded.
  - `controls/behavior/useControlsNarrow.ts:8-11` measures the `.controls-settings` container (below 640 px), and `ControlsSettings.css:67-87` turns an opened panel into an overlay drawer over the bindings.
- **ChronoKi:**
  - `src/input/controls/useFoldWhenNarrow.ts:6` keeps the fold in component state, so Profiles folds again on every visit to Controls.
  - The narrow test uses the window width (`NARROW_FOLD_WIDTH = 1100`, `controls.constants.ts:41`) instead of the container width.
  - `ControlsSettings.css:28-40` stacks the three columns vertically below 640 px. An unfolded panel then pushes the bindings down instead of overlaying them.
- **Fix:**
  1. Persist the fold per panel under RotP's two keys, in a small stored-fold hook, keeping the default (Profiles folded).
  2. Measure the container with a ResizeObserver at 640 px.
  3. Port RotP's `controls-settings__side--open` drawer rules in place of the column stack.

### R4-G6. The Save State Overlay closes itself after 4 seconds, even when opened from the title bar (minor)
- **RotP:**
  - `src/stores/save-overlay-store/useSaveOverlayStore.ts:5-9`: the title-bar and menu toggle is a plain `shown` flag with no timer, so the overlay stays until it is toggled again or the game stops (`views/GameSession/behavior/useSaveOverlay.ts:12`).
  - The shortcut open (`views/SaveStateOverlay/behavior/useEnhancedSaveSlot.ts:44`, `handle-function-key-up.ts:24-31`) closes after the save or load, or on other input. It has no idle timer either.
- **ChronoKi:**
  - `src/game/save-overlay/open-save-overlay.ts:7` calls `armIdleClose()` on every open, including `toggle-save-overlay.ts:12`.
  - `arm-idle-close.ts:9` then closes after `IDLE_CLOSE_MS = 4000` (`save-overlay.constants.ts:8`).
  - So an overlay opened from the title bar to browse slots disappears after 4 s. No board decision records this timer.
- **Fix:** arm the idle close only when `slot !== null` (the shortcut and slot-step paths). Either keep it there as a recorded ChronoKi decision for slot stepping, or drop it too, to match RotP's close-on-other-input.

## Checked, not counted

- **Device meta without a bus:** RotP shows "Ready, USB". ChronoKi's `DetectedDevice` has no bus field (`packages/input-mapping/src/profiles/profiles.type.ts:23-38`), because controller grouping was the accepted Devices simplification (round 3). "Ready" alone is fine.
- **Rail buttons:** ChronoKi uses `size="sm"` where RotP uses the default size, and there is no drag on the device rail (the drag was accepted as dropped in round 3). Cosmetic.
- **Generic slot actions:** "Save State", "Load State", "Next Save Slot" and "Previous Save Slot" are ChronoKi extras with handlers and default no binding. Listing them is right.
- **Reserved "Open Menu / Esc" row:** it has no device slot (`FunctionBindingsTab.tsx:23-31`). It is never a pad binding, so nothing is missing.
- **Restart toast:** `useRestartWarning.ts:21-24` still dismisses on `launchId` as well. This is redundant with the new running edge but harmless.
- **Turbo description:** "Music keeps its tempo." is left out, as round 3 advised, because it is unverified for the engine.
- **Unchanged screens walked again:** Home (game and data), Storage, ROMs, Profiles/ProfileManager, Picture, Window, Audio, Gameplay, Enhancements, Contributing, Credits, the title-bar actions (`src/title-bar/*.action.ts`), the shell menu, and the Pause and Profile Switcher overlays. Batch H did not touch them, and they read the same as in round 3.
- **RotP views with no ChronoKi counterpart:** `GameOverlay`, `TitleView`, `PauseMenuView`, `EnhancedPauseView` and the extras page `gba.custom.tsx` are ALttP or randomizer parts. `InputTester` serves the Sanctuary-backed controller report. All are out of scope.

## Verdict

| Severity | Open | Findings |
|---|---|---|
| Major | 0 | none |
| Minor | 4 | R4-K8 (regression), R4-K9 (rest of R3-K6), R4-K10 (rest of R3-K7), R4-G6 |

Round 3: 6 of 8 fixed. 2 are partly done (R3-K6 is now R4-K9, R3-K7 is now R4-K8 and R4-K10).

All rules hold, and no major is open. The four minors are small, local fixes on the Controls side panels, the binding rows and the overlay timer.

Verdict: FAIL (0 major, 4 minor open)
