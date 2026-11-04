# Peer review, round 5: ChronoKi against RotP, screen by screen

Reviewer: an independent peer review, done by reading code only (no builds, tests or launches).
Date: 2026-11-04. The comparison is ChronoKi `main` at `cd3ea25` (batch I, `905f0e6..cd3ea25`) against RotP's `apps/desktop` in its current state. RotP has no commit under `apps/desktop/src` since round 4.

Paths are relative to each repository root:
- RotP = `X:/relic-of-the-past`
- ChronoKi = `X:/chronoki`

Most app paths sit under `apps/desktop/src`, written below as `src/`.

Requirements used: `plans/chronoki-port.html`, `CLAUDE.md`, rounds 1 to 4 (`docs/parity/peer-review-round-1.md` to `peer-review-round-4.md`) and the lead decisions below.

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
- Plain SNES button names as action labels where Chrono Trigger has no fixed action.
- The fold logic sits in one hook (`useFoldWhenNarrow`) instead of RotP's two (`useStoredFold` plus a narrow effect in each panel), with the same behaviour.

## 1. Round 4 status

| ID | Status | Evidence (ChronoKi unless marked RotP) |
|---|---|---|
| R4-K8 | Fixed | `src/input/controls/ProfilesPanel.tsx:12-15` defines `handleAdd` as `expand()` then `ctrl.create()`, and `:37` wires the rail and header "New profile" button to it. This is RotP's `ControlsProfiles.tsx:20-23`. |
| R4-K9 | Fixed (logic), with a layout leftover in R5-K11 | `src/input/controls/binding-device-icon.ts:13` returns nothing for keyboard and empty bindings. `:14` returns nothing without a vid:pid or when `allowedDevices(profile).gamepadKeys.size < 2`. This matches RotP's `button-display-mapping.ts:26-28`, `gamepad-display-mapping.ts:11,13` and `useDisplayMappings.ts:12`. Both tabs pass the active profile (`SnesBindingsTab.tsx:25`, `FunctionBindingsTab.tsx:40`). The slot now sits before the label (`BindingRow.tsx:35-40`). But the empty slot is always rendered: see R5-K11. |
| R4-K10 | Fixed | **Stored fold:** `useFoldWhenNarrow.ts:8-13` reads and writes through `read-fold.ts` and `write-fold.ts` under RotP's keys (`controls.constants.ts:42-43`, RotP `controls.constants.ts:79-80`). The default is kept (Profiles folded, `:44`; Devices open, `DevicesPanel.tsx:15`). This is RotP's `useStoredFold.ts:8-17`. **Container width:** `useControlsNarrow.ts:5-17` observes `.controls-settings` with a ResizeObserver at 640 px (`controls.constants.ts:41`). It is a line-for-line copy of RotP's `controls/behavior/useControlsNarrow.ts:4-15` and is called once (`ControlsSettings.tsx:24,44,57`). The narrow fold is `useFoldWhenNarrow.ts:14-16`, as RotP's `ControlsProfiles.tsx:15-17` and `ControlsDevices.tsx:19-21`. **Drawer:** `ControlsSettings.css:28-49` is RotP's `ControlsSettings.css:67-88`. `side-slot-class.ts:2-6` is RotP's `side-slot-class.ts`. The slots wrap both panels (`ProfilesPanel.tsx:17`, `DevicesPanel.tsx:17`). `.controls-settings` keeps `position: relative` (`ControlsSettings.css:2-8`), so the drawer anchors as in RotP. The column stack is gone. Tessera's `onCollapsedChange` passes a boolean (`SidePanel.type.ts:22`), so `setCollapsed` is a valid stand-in for RotP's `toggle`. |
| R4-G6 | Partly | The title-bar case is fixed. `arm-idle-close.ts:9` returns early when `slot === null`, so an overlay opened by `toggle-save-overlay.ts` (slot `null`) stays until it is toggled again, as RotP's `useSaveOverlayStore.ts:5-9` does. A mouse save from that overlay does not arm a timer either (`useOverlaySlots.ts:27`, slot still `null`). Left over: the shortcut paths keep the 4 s timer, and no board decision records it. See R5-G7. |

**Regression check of batch I:**
- **Gating:** no regression. Batch I adds no feature and touches no gate, `featureIdOf`, `lockCauseOf` or Original Mode lock.
- **Storage rule:** the fold flags go to `localStorage`, as RotP's do. They are UI layout preferences, not user files, so the userData-per-profile rule is untouched.
- **Stack rules:** no new dependency, no SDL, no vendored engine. Every change sits in `src/input/controls` and `src/game/save-overlay`.
- **Behaviour:** one small layout regression, R5-K11. Moving the always-present device slot before the label shifts every binding label right and leaves the reserved "Open Menu / Esc" row out of line.

## 2. New findings

### R5-K11. An empty device slot is reserved on every binding row (minor, batch I regression, rest of R4-K9)
- **RotP:**
  - `src/views/ProfileHub/sub-components/controls/BindingRow.tsx:47-51` renders the device slot only when `deviceIconUrl` is set.
  - The slot is the small `binding-row__device-icon-slot` (`BindingRow.css:93-100`, `--space-lg`).
  - So keyboard rows and single-pad rows have no gap between the binding glyph and its label.
- **ChronoKi:**
  - `src/input/controls/BindingRow.tsx:35-37` always renders a `binding-row__icon-slot` box, even when `deviceIconSrc` is undefined.
  - That box is 28 px wide (`BindingRow.css:64-71`), plus the row gap (`:52`).
  - Since batch I moved it before the label, every label on both tabs sits about 28 px plus the gap further right than in RotP, after a blank space.
  - The reserved "Open Menu / Esc" row (`FunctionBindingsTab.tsx:23-33`) has only two slots. Its "Esc" label (`:31`) now sits out of line with the rebindable rows under it. It lined up before batch I, when the empty slot came after the label.
- **Fix:** render the slot only when there is an icon (`{!isNone && deviceIconSrc && <Box className="binding-row__device-icon-slot">…</Box>}`), with RotP's smaller slot class. The reserved row then lines up again.

### R5-G7. The Save State Overlay still closes after 4 s on the shortcut paths, with no recorded decision (minor, rest of R4-G6)
- **RotP:**
  - `src/views/SaveStateOverlay/behavior/handle-function-key-up.ts:29-31`: a release between the tap and hold thresholds cancels the hold and shows the idle hints. The overlay stays open until other input (`useCancelOnOtherInput.ts`) or the next save or load.
  - The SaveStateOverlay behaviour has no idle timer at all. Its only `setTimeout` is the open and close animation (`useSaveSlots.ts:26,29`).
- **ChronoKi:**
  - `src/views/GameSession/behavior/release-save-key.ts:14` calls `armIdleClose()` on that same middle release.
  - `step-slot.ts:8` (through `open-save-overlay.ts:7`) and the overlay's mouse save while a slot is highlighted (`useOverlaySlots.ts:27`) also arm it.
  - `arm-idle-close.ts:10` then closes after `IDLE_CLOSE_MS = 4000` (`save-overlay.constants.ts`).
  - Round 4 allowed keeping the timer only as a recorded ChronoKi decision. The board has none: D-1 to D-30 hold no overlay timer decision, and I-60 only says "G6 fixed".
- **Fix:** either drop `armIdleClose()` from `release-save-key.ts:14` and `useOverlaySlots.ts:27`, to match RotP's close-on-other-input, or record a one-line `coord decide` that keeps the 4 s idle close for the shortcut paths. Slot stepping (`step-slot.ts`) is a ChronoKi extra, so a timer there fits a decision.

## Checked, not counted

- **Fold hook naming:** `useFoldWhenNarrow` returns `setCollapsed(next)` where RotP returns `toggle()`. Tessera passes the new value, so the behaviour is the same. Accepted as one hook.
- **Narrow re-fold writes storage:** when the container drops below 640 px, both panels fold and the folded state is stored. RotP's `collapse()` does the same, so a panel is folded again at the next visit after a narrow window. This matches RotP.
- **Generic pad icon fallback:** `binding-device-icon.ts:16` falls back to `GENERIC_DEVICE_ICON` when the device is not connected. RotP's `resolveLiveFamilyIcon` also falls back to a generic controller icon (`family-icon-map.ts:15`), though it first tries the recalled SDL type. Same visible result for an unknown pad.
- **Drawer has no click-outside close:** this matches RotP, which closes the drawer only from its own fold button.
- **Width storage keys:** `controls:profiles-width` and `controls:devices-width` are RotP's (`ProfilesPanel.tsx:21`, `DevicesPanel.tsx:22`).
- **Reconnect layer under SDL names** (`core/reconnect/SDL.h`): this is D-7 and D-8. No SDL is linked, so the no-SDL rule holds. The engine stays imported by pin (`core/belthasar.pin.json`).
- **Unchanged screens walked again:** Home (game and data), Settings subpages (Storage, ROMs, Picture, Window, Audio, Gameplay, Enhancements, Contributing), Saves, Profiles/ProfileManager, Credits, the title-bar actions, the shell menu, and the Pause and Profile Switcher overlays. Neither repository changed these files since round 4 (ChronoKi `d341eb6..905f0e6` is the review document only, and RotP `apps/desktop/src` has no newer commit). They read the same as in round 4, and no new gap was found.
- **RotP views with no ChronoKi counterpart** (`GameOverlay`, `TitleView`, `PauseMenuView`, `EnhancedPauseView`, `gba.custom.tsx`, `InputTester`): out of scope, as in round 4.

## Verdict

| Severity | Open | Findings |
|---|---|---|
| Major | 0 | none |
| Minor | 2 | R5-K11 (batch I regression, rest of R4-K9), R5-G7 (rest of R4-G6) |

Round 4: 3 of 4 fixed (R4-K8, R4-K9 logic, R4-K10). R4-G6 is partly done and goes on as R5-G7.

All rules hold, and no major is open. Both minors are one-line fixes: a conditional slot in `BindingRow.tsx`, and either two removed timer calls or one recorded decision.

Verdict: FAIL (0 major, 2 minor open)
