# Peer review, round 7: ChronoKi against RotP, screen by screen

Reviewer: an independent peer review, done by reading code only (no builds, tests or launches).
Date: 2026-11-04. The comparison is ChronoKi `main` at `9486723` (`1e90ae2..9486723`, two files: `BindingRow.tsx` and `BindingRow.css`) against RotP's `apps/desktop` in its current state. RotP has not moved during the review loop (newest commit under `apps/desktop/src` is still `5838adc2a`, 2026-11-03).

Paths are relative to each repository root:
- RotP = `X:/relic-of-the-past`
- ChronoKi = `X:/chronoki`

Most app paths sit under `apps/desktop/src`, written below as `src/`.

Requirements used: `plans/chronoki-port.html`, `CLAUDE.md`, rounds 1 to 6 (`docs/parity/peer-review-round-1.md` to `peer-review-round-6.md`) and the lead decisions below.

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
- D-31: the 4 s idle close of the Save State Overlay stays only on the keyboard-shortcut paths; opening from the menu or the title bar has no timer, as in RotP.
- Plain "Hold Save for Slot Picker" wording, because the lint bans "Enhanced" in settings prose.
- Plain SNES button names as action labels where Chrono Trigger has no fixed action.
- The fold logic sits in one hook (`useFoldWhenNarrow`) instead of RotP's two, with the same behaviour.

## 1. Round 6 status

| ID | Status | Evidence (ChronoKi unless marked RotP) |
|---|---|---|
| R6-K12 | Fixed | `src/input/controls/BindingRow.tsx:35-39` wraps the device icon in `binding-row__device-icon-slot` with `binding-row__device-icon-img`, rendered only when `!isNone && deviceIconSrc`, as RotP's `src/views/ProfileHub/sub-components/controls/BindingRow.tsx:47-51`. `BindingRow.css:99-107` is RotP's `BindingRow.css:93-101` declaration for declaration (`width`/`height: var(--space-lg)`, which Tessera resolves to `--size-16`; flex centring; `flex-shrink: 0`; `opacity: 0.75`), and `BindingRow.css:109-113` is RotP's `:103-107` (`100%` box, `object-fit: contain`). The old `.binding-row__device-icon` rule (20 px, `opacity: 0.8`) is gone and no file references it. A multi-pad row now shows the same small, dimmed 16 px mark, and its label sits where RotP's does. |

**Regression check of `9486723`:** the change renames two classes in one JSX block and replaces one CSS rule with RotP's two. The 28 px glyph slots (`BindingRow.css:64-71`, used at `BindingRow.tsx:28,32`), the label, the clear button, the hover/focus rules and the reserved row (`FunctionBindingsTab.tsx:23-33`, which never had a device slot) are untouched. No gate, feature, storage path, dependency or engine file changed. All rules hold.

## 2. Earlier rounds, re-verified

ChronoKi changed only `BindingRow.tsx` and `BindingRow.css` since round 6, and RotP did not change, so every anchor of the earlier fixed findings is as round 6 recorded it.

| Round | Findings | Still holds |
|---|---|---|
| 1 | S1 to S5, H1 to H7, G1 to G3, P1 to P3, A1, GP1, GP2, E1, E2 (D-25), C1, W1, K1, K2, D1 to D4 | Untouched files; round 6 anchors stand (`src/main.tsx:41-42`, `brock.config.ts:12,17`, `main.constants.ts:8`, the title-bar frame/refresh items, `screens/game/home.hero.tsx`). |
| 2 | R2-S6, R2-S7, R2-K3, R2-K4, R2-G4, R2-P4, R2-GP3, R2-D5 | Untouched files (`warn-restart-needed.ts:10`, `LockOverlay.constants.ts:3`, `ProfileManager.constants.ts:17`). R2-K3/K4 binding-row glyphs: `BindingRow.tsx:28-34` unchanged. |
| 3 | R3-K5, R3-K6, R3-K7, R3-G5, R3-S8, R3-W2, R3-D6, R3-C2 | Untouched files (`profiles.page.tsx:8`, `credits.card.tsx:5`, `host-features.constants.ts:4-35`). R3-K6 columns: `SnesBindingsTab.tsx:20-22` unchanged. |
| 4 | R4-K8, R4-K9, R4-K10, R4-G6 | R4-K9 logic in `binding-device-icon.ts` unchanged; both tabs still pass `bindingDeviceIcon(...)` (`SnesBindingsTab.tsx:25`, `FunctionBindingsTab.tsx:40`). |
| 5 | R5-K11, R5-G7 | R5-K11: the conditional slot (`BindingRow.tsx:35`) is kept. R5-G7 (D-31): untouched files. |
| 6 | R6-K12 | Section 1. |

## 3. New findings

None.

## 4. Rule checks

- **Gating:** unchanged; every ChronoKi-only host feature sits in `host-features.constants.ts` with a gate, and the parity-affecting ones are locked in Original Mode.
- **Storage:** unchanged; user files stay in userData per profile.
- **No Chrono Trigger assets:** the change adds no file; the device icon is the existing generic glyph set.
- **CT's in-game Config:** unchanged; no setting duplicates the game's own Config menu.
- **Stack:** Brock and Tessera only; no SDL package.
- **Engine imported:** `core/belthasar/` stays git-ignored and pinned.

## Checked, not counted

- **Row hover colour.** ChronoKi's `.binding-row:hover` is `--c-bg` (`BindingRow.css:32-34`) where RotP's is `--c-surface` with an `:active` of `--c-bg` (RotP `BindingRow.css:42-48`). Both lists sit on a `--c-surface` card (RotP `ControlsSettings.css:48-53` on `controls-settings__bindings`, ChronoKi `ControlsSettings.css:79-86` on the list), so RotP's hover rule paints the card's own colour and only the press shows `--c-bg`; ChronoKi shows that same `--c-bg` already on hover. Same token, same row, a visible cue on a clickable row; predates the loop and is not a regression.
- **`!isNone` guard on the device slot.** ChronoKi checks `!isNone && deviceIconSrc`; RotP checks `deviceIconUrl` only, but its mapping never sets a URL for an empty binding (round 5), so both render the same rows.

## Verdict

| Severity | Open | Findings |
|---|---|---|
| Major | 0 | none |
| Minor | 0 | none |

R6-K12 is fixed and matches RotP's device slot exactly. Every earlier finding still holds, the binding row did not regress, and all rules hold.

Verdict: PASS
