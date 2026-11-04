# Peer review, round 6: ChronoKi against RotP, screen by screen

Reviewer: an independent peer review, done by reading code only (no builds, tests or launches).
Date: 2026-11-04. The comparison is ChronoKi `main` at `535777c` (`1ccabc9..535777c`, one file: `BindingRow.tsx`) against RotP's `apps/desktop` in its current state. RotP's newest commit under `apps/desktop/src` is `5838adc2a` (2026-11-03), older than round 1, so RotP has not moved during the review loop.

Paths are relative to each repository root:
- RotP = `X:/relic-of-the-past`
- ChronoKi = `X:/chronoki`

Most app paths sit under `apps/desktop/src`, written below as `src/`.

Requirements used: `plans/chronoki-port.html`, `CLAUDE.md`, rounds 1 to 5 (`docs/parity/peer-review-round-1.md` to `peer-review-round-5.md`) and the lead decisions below.

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
- D-31: the 4 s idle close of the Save State Overlay stays only on the keyboard-shortcut paths (slot step, tap release, saving from an overlay opened by the shortcut), because there the overlay opens over live gameplay. Opening from the menu or the title bar has no timer, as in RotP.
- Plain "Hold Save for Slot Picker" wording, because the lint bans "Enhanced" in settings prose.
- Plain SNES button names as action labels where Chrono Trigger has no fixed action.
- The fold logic sits in one hook (`useFoldWhenNarrow`) instead of RotP's two, with the same behaviour.

## 1. Round 5 status

| ID | Status | Evidence (ChronoKi unless marked RotP) |
|---|---|---|
| R5-K11 | Partly | **Fixed:** the empty slot is gone. `src/input/controls/BindingRow.tsx:35-39` renders the device slot only when `!isNone && deviceIconSrc`, as RotP's `BindingRow.tsx:47-51`. Keyboard rows and single-pad rows have no blank gap, and the reserved "Open Menu / Esc" row (`FunctionBindingsTab.tsx:23-33`) lines up with the rows under it again, as RotP's `ShortcutsTab.tsx:15-25`. **Left over:** the slot that is drawn still uses the 28 px glyph slot class, not RotP's smaller device slot. See R6-K12. |
| R5-G7 | Fixed (D-31) | `arm-idle-close.ts:9` returns when `slot === null`, so the menu entry (`shell/chronoki-menu.constants.ts:6`) and the title-bar button (`hooks/useSaveStatesTitleBarItem.ts:10`), which both open through `toggle-save-overlay.ts:12` with `null`, never arm a timer, as RotP's `useSaveOverlayStore.ts:5-9`. The timer is armed only on the shortcut paths D-31 names: the middle release (`release-save-key.ts:14`), the slot step (`step-slot.ts:8` through `open-save-overlay.ts:7`) and a save from an overlay that has a slot (`useOverlaySlots.ts:27`). The hold itself clears it (`start-save-hold.ts:16`), so a long hold is never cut short. |

**Regression check of `535777c`:** the change touches one JSX block in `BindingRow.tsx`. No gate, feature, storage path, dependency or engine file changed. All rules hold.

## 2. Earlier rounds, re-verified

ChronoKi's app and package code changed only in `src/input/controls` since round 4 (`905f0e6..535777c`), and only in `BindingRow.tsx` since round 5. RotP did not change. Spot checks on the anchors of the fixed findings all still hold:

| Round | Findings | Still holds (sample anchors) |
|---|---|---|
| 1 | S1 to S5, H1 to H7, G1 to G3, P1 to P3, A1, GP1, GP2, E1, E2 (D-25), C1, W1, K1, K2, D1 to D4 | `src/main.tsx:41-42` (`bugReport`, `withOwnRowTabs`); `brock.config.ts:12,17` (copyright, wordmark); `main.constants.ts:8` (volume `max: 100`); `title-bar/useFrameRateTitleBarItem.ts:10` and `useRefreshRateTitleBarItem.ts:11` open `game/picture`, word for word RotP's `hooks/useFrameRateTitleBarItem.ts`; `screens/game/home.hero.tsx` keeps RotP's hero slots (Mode eyebrow, Actions, Tools, Facts, last save Aside, progress Panel) and returns null without a profile. |
| 2 | R2-S6, R2-S7, R2-K3, R2-K4, R2-G4, R2-P4, R2-GP3, R2-D5 | `settings-effects/warn-restart-needed.ts:10` (RotP's toast, `danger`, `duration: 0`); `packages/design/src/lock-overlay/LockOverlay.constants.ts:3` ("Disabled in Original Mode"); `ProfileManager.constants.ts:17` (`enhanced: 'Enhanced'`). |
| 3 | R3-K5, R3-K6, R3-K7, R3-G5, R3-S8, R3-W2, R3-D6, R3-C2 | `profiles.page.tsx:8` (keyword `enhanced`); `screens/credits.card.tsx:5` (`trophy`, `contributors`); `packages/features/src/feature-registry/host-features.constants.ts:4-35` (RotP's texts). |
| 4 | R4-K8, R4-K9, R4-K10, R4-G6 | Unchanged since round 5. R4-G6 closes with R5-G7 above. |
| 5 | R5-K11, R5-G7 | Section 1. |

## 3. New findings

### R6-K12. The device icon slot is RotP's glyph size, not its device size (minor, rest of R5-K11)
- **RotP:**
  - `src/views/ProfileHub/sub-components/controls/BindingRow.tsx:48-49` wraps the device icon in `binding-row__device-icon-slot` with `binding-row__device-icon-img`.
  - `BindingRow.css:93-100` sizes that slot at `--space-lg` (16 px) with `opacity: 0.75`, and `:103-107` fills it with the image.
  - So on a multi-pad profile the pad icon is a small, dimmed 16 px mark, and the label moves 16 px plus the gap.
- **ChronoKi:**
  - `src/input/controls/BindingRow.tsx:36-37` wraps it in `binding-row__icon-slot`, the 28 px box used for the binding glyph (`BindingRow.css:64-71`).
  - The image is 20 px at `opacity: 0.8` (`BindingRow.css:99-104`).
  - So on a multi-pad profile every pad row shows a larger icon, and its label sits 12 px further right than in RotP, next to keyboard rows that have no slot.
- **Fix:** port RotP's two classes into `BindingRow.css` (`.binding-row__device-icon-slot { width: var(--space-lg); height: var(--space-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: 0.75; }` and `.binding-row__device-icon-img { width: 100%; height: 100%; object-fit: contain; }`), use them at `BindingRow.tsx:36-37`, and drop the old `.binding-row__device-icon` rule.

## 4. Last full walk

Walked again against RotP: Home (game hero and Data home), the Settings subpages (Storage, ROMs, Picture, Window, Audio, Gameplay, Enhancements, Contributing), Controls (both side panels, the three tabs, the binding rows, the reserved row, the dialogs), Saves (Home columns, dialogs, Saves and play tab), Profiles (list, detail tabs, create wizard), Credits, the title bar (volume, Save States, frame rate, refresh rate), the shell menu and the Save State, Pause and Profile Switcher overlays. Apart from R6-K12, nothing new was found.

Rule checks:
- **Gating:** every ChronoKi-only host feature is in `host-features.constants.ts` with a gate. Turbo, Linear Filtering and the slot picker carry `affectsVanillaParity: true`, so Original Mode locks them. Save states, auto-save and save on quit stay open, as round 3 accepted. The old `scaleStretch` gate only migrates (`useLegacyStretchMigration.ts:11-12`).
- **Storage:** unchanged since round 4; user files stay in userData per profile, split.
- **No Chrono Trigger assets:** the only tracked images are the generic and console button glyphs under `public/buttons`, the ChronoKi wordmark (`public/logos/wordmark.svg`, aria-label "ChronoKi") and the Android icons and splashes made from the ChronoKi mark (`e96086a`).
- **CT's in-game Config:** no setting duplicates battle speed, message speed, battle mode, cursor memory or stereo; only the asset extractor names the menu's config icons.
- **Stack:** Brock and Tessera only; no SDL package in any `package.json`.
- **Engine imported:** `core/belthasar/` is git-ignored (`.gitignore:38`) and pinned by `core/belthasar.pin.json`; the `core/reconnect` SDL-named shim links no SDL (D-7, D-8).

## Checked, not counted

- **Bug report recordings: previews, "Sent" tag and "Show sent" toggle.** RotP's `views/BugReportRecordings/sub-components/RecordingsPicker.tsx:20,36-38` shows a video or frame preview per recording and hides sent ones by default; ChronoKi's `RecordingsPicker.tsx:14` shows the event count and preselects every recording. The previews need RotP's ffmpeg screen capture, which round 1 (S1, step 5) scoped out in favour of app-side data. The sent mark is written only by Sanctuary's upload (RotP `electron/sanctuary/bug-report/upload-attachment.ts:13`), which is out of scope. If ChronoKi's own report path ever records a send, the toggle can follow.
- **Create wizard steps:** ChronoKi's wizard is Profile, Mode, Review in Tessera's vertical `Wizard` with `stepperSize="sm"` (`ProfileCreateWizard.tsx:12`), as RotP's `ProfileCreateWizard.tsx:14-22` minus the randomizer, MSU and connection steps. This is the plan's short wizard (`docs/parity/data-and-shell.md:164`).
- **`ModeBadge`:** RotP renders the component nowhere outside its usage file; it only uses the labels, as ChronoKi's `MODE_LABELS` does.
- **Credits and title bar:** ChronoKi's `views/CreditsPage` and `title-bar/*` are line-for-line RotP's `CreditsTab`, `CreditEntryCard` and title-bar actions; the Save States button also hides when the gate is off, which fits the gating rule.

## Verdict

| Severity | Open | Findings |
|---|---|---|
| Major | 0 | none |
| Minor | 1 | R6-K12 (rest of R5-K11) |

Round 5: R5-G7 is closed by D-31 and matches it in code. R5-K11 is fixed for the empty slot and the reserved row; the slot size left over goes on as R6-K12, a CSS-only change in two files.

All rules hold, and no major is open.

Verdict: FAIL (0 major, 1 minor open)
