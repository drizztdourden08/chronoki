# Tall rendering: an engine patch (I-74)

Owner decision, 2026-11-04: build true tall rendering, meaning a picture of more than 224 lines with real extra rows above and
below the SNES view, as an engine patch.

- It is gated. With the gate off, the engine is unchanged byte for byte.
- It is developed and tested in its own worktree before it reaches main.
- The engine changes only through build-time exact-match patches (`core/wasm-build/patches/`) and files under `core/reconnect`.
  `core/belthasar` is never edited.

Related: `docs/plans/aspect-ratio-parity-plan.md` section 3 (why tall was split out) and the widescreen's `wide_width`
(`ck_wide_width`, the hostWideW patch in `state-patches.mjs`), which this mirrors.

## 1. Approach

**The rows above and below the view are drawn the way the widescreen draws its side columns.** The field compositor in
`field.c` `main()` already draws a "view inside a bigger picture" when the widescreen is on:

1. It composes into `g_wfb`.
2. It copies the 256 view back to the frame.
3. The overlays (box, wipe, fade) draw on the view.
4. `fieldWideAssemble` puts the sides around the finished view.

Tall reuses that structure vertically.

- **Offset-origin buffers.** These buffers are sized for the cap:
  - the picture (`g_wfb`);
  - the priority-3 mask (`front`);
  - the player mask (`pmask`).

  While the compositor draws tall, its pointers point at the view's first row inside them. A band row is therefore a row
  index below 0 or from 224 on. Every view-row table (the iris window rows, the HDMA rows, the wipe, the box, the motion
  record) keeps its own indices and never sees a band row.
- **What fills the bands:**
  - The map's rows, taken from the field's baked canvas (`f.base`, all layers) at `camy + y`.
  - Then the sprites (`plot` and `drawSprite` accept band rows while `g_ft > 0`).
  - Then the foreground's priority pixels (`ckTallFg`).
- **At the compose's end** the 224 view rows go back to the frame and the overlays draw on them as before. The frame shown is
  `ckTallAssemble`: the bands, at the frame's brightness and with the wipe carried on, around the finished view.
- **Tall and wide never combine.** Tall is active only when `hostWideW() == 256`, so the two paths stay separate and wide mode
  is untouched.

## 2. The gate

- **The setting.** `[video] tall_lines` in `ct_settings.ini` is read by `core/reconnect/settings_reconnect.c` and returned
  by `ck_tall_lines()`. These values mean off (224):
  - unset;
  - 224;
  - anything out of range.

  Otherwise the value is made even, up to `CK_TALL_LINES_MAX` (480, in `core/reconnect/ck_reconnect.h`).
- **The host-side check.** `hostTallT()` (`core/reconnect/ck_tall_host.inc`) returns the band rows a side: `(lines - 224) / 2`.
  It returns 0, meaning off, when:
  - the run is headless (the suite and the oracle never see tall);
  - the widescreen is on;
  - the option is off.
- **The two globals.** The compositor sets `g_ft` and `g_ckTallT` from `hostTallT()` only for field frames. Both stay 0 for:
  - battle;
  - the battle test;
  - game over;
  - the overworld;
  - no scene VM.
- **Off is exact.** With both at 0, every patched site reduces to the original code:
  - each inserted branch tests `g_ft` or `g_ckTallT` first;
  - each pointer offset is `+ 0`;
  - the memsets clear `224 + 0` rows;
  - the only other change is larger static buffers.

**Why the cap is 480.** 480 lines is 224 + 2 × 128.

- It is RotP's own vertical budget: `kPpuExtraTopBottom = 128` in `core/zelda3/src/types.h`, and its `MIN_ASPECT` is 256/480.
- At 544 × 480 × 3, each of the two grown static frame buffers is about 783 KB, well inside the 256 MB initial memory.
- A taller picture is not needed. On a 16:9 screen, 256 × 480 already shows more rows than the map holds in most rooms.

## 3. Site inventory

The table counts lines in the engine (`core/belthasar`, pin of 2026-11-04) that mention `CAMH`, `CT_MOT_H` or a literal 224,
and the sites each phase patches.

| File | Lines mentioning CAMH / CT_MOT_H / 224 | What they are | Patched by |
|---|---:|---|---|
| `src/field.c` | 342 (314 CAMH + 29 literal) | the field compositor, the present, the overlays, the battle draw | T1: 24 triples (below) |
| `src/main.c` | 39 (literal 224) | the C2 menu and naming screens | none (menus stay 224, letterboxed) |
| `src/motion.h` / `motion.c` | 9 / 4 | `CT_MOT_H` 224, the motion record (interpolation) | T2 or later (interpolation in tall) |
| `src/fieldnative.c` / `.h` | 5 / 3 | the native drawer of the frames between | with interpolation |
| `src/title_intro.c` / `.h` | 8 / 1 | the title's mode-7 picture | T4 |
| `src/battle.c` | 6 | the battle's layers | T3 |
| `src/seq_pic.c` / `.h`, `seq_ppu.*`, `seq_xlat.*`, `seq_gwarp.h` | 5 / 2, 3, 2, 1 | the $FD sequences (cutscenes) | T4 |
| `src/world.c`, `ct_world.c` | 3, 1 | the overworld | T2 |
| `snes/ppu.c`, `snes/snes.c` | 3, 7 | the PPU (239-line mode) and the frame timing | not needed (the port composes its own picture) |
| `src/menu.c` / `.h`, `audio.c`, `wipe.h`, `tables/atbsel.h` | 2 / 1, 3, 1, 1 | menus, sound timing, the wipe table, the ATB selector | none |

### T1 triples

T1 has 24 triples, all in `src/field.c` and each with count 1. They live in `core/wasm-build/patches/tall-field.mjs` and are
applied after `state-patches.mjs`, to its patched copy.

| # | Site | Change |
|---|---|---|
| 1 | `#define FIELD_WMAX` | include `ck_tall_defs.inc` (cap, `g_ft`, `g_ckTallT`, `g_ckShowH`) |
| 2–3 | `g_wfb`, `g_wide` | sized `FIELD_WMAX × CK_FIELD_HMAX` |
| 4 | after `hostUpload` | include `ck_tall_host.inc` (`hostTallT`, `ckTallUpload`) |
| 5 | `hostUploadPictureAt` | tall: every picture goes up at 256 × H; a 224 frame is letterboxed |
| 6 | `hostInterp` | no frames between while tall |
| 7 | `plot` | band-row branch |
| 8 | after `fieldBaseAt` | include `ck_tall_field.inc` |
| 9 | `drawSprite` | band rows mark `front` and `allMask` |
| 10–11 | `front`, `pmask` mallocs | sized for the cap; base pointers kept (`ckFront0`, `ckPmask0`) |
| 12 | compose start | `g_ft` set; `fb`, `front`, `pmask` offset |
| 13 | the three memsets | cover the bands |
| 14 | after the base map | `ckTallMap` (bands; black past the room) |
| 15–17 | widescreen's own objects | also on tall; unlatched objects above and below drawn |
| 18 | foreground, view rows | blanked rows past the room stay black |
| 19 | before the caption plane | `ckTallFg` (the bands' foreground) |
| 20 | compose end | view rows back to the frame; `g_ft` and pointers reset |
| 21 | the IRQ blank (211–223) | not applied while tall |
| 22 | before the widescreen assembly | the tall assembly branch |
| 23 | after `hostPresentMot` | `g_ckTallT` reset |
| 24 | `free(front); free(pmask)` | frees the base pointers |

## 4. The room edge

The SNES never shows a row past the room: the camera stops at the scroll mask (`Field.my0` / `my1`) and the V-IRQ blanks
lines 211–223. The map past those rows holds other rooms, or the map wrapping onto its own top. Showing them would be wrong.

- **Out-of-room rows are black.** A band row whose map row `camy + y` lies outside `[my0, my1)` is black. So is a view row
  ≥ 211 outside it. The rule is `ckTallInRoom`. Sprites still draw over black rows, as the widescreen's sides do.
- **A wrapping room has no edge.** When the mask is taller than the map (`my1 - my0 > H`), the camera wraps the map itself.
  This is `fieldWideMask`'s rule, on the other axis.
- **Inside the room, rows 211–223 are drawn.** This is the bottom-lines mod's behaviour, and it is forced on while tall.
- **This matches RotP's default:** a black band past the room. RotP's camera lock is an optional setting.

A later refinement is a vertical view hold, analogous to `fieldWideViewX`. It would move the view inside the tall picture at a
room's edge so the bands show more room rather than black. It is not in T1.

## 5. Phases and acceptance

- **T1, field scenes (this patch).**
  - Acceptance:
    - Off (`tall_lines` unset or 224): frames identical to main's at the same save state and frame count.
    - On (`tall_lines=320`, widescreen off): a field room shows a 256 × 320 picture, with the unchanged 224 view in the
      middle and map rows in the bands.
    - Black past the room's top and bottom, with no next-room bleed.
    - Sprites cross the view's edges without clipping.
    - Menus, battles, the overworld, cutscenes and the title are letterboxed to 256 × 320.
    - The build applies every triple and links.
  - Not in T1, inside the bands only:
    - the BG3 caption plane;
    - the iris window;
    - the colour window and sub-screen sprite math;
    - the occluder stencil (a priority-0/1 sprite pixel shows the map pixel, which is correct unless another sprite lies under it).
  - Not in T1, whole frame:
    - interpolation (forced off);
    - render scale (forced 1×);
    - the motion record (invalid on tall frames);
    - the vertical view hold.
- **T2, overworld.**
  - Work: `worldComposeAt` into an offset-origin buffer, plus the overworld's own assembly at 13237.
  - Acceptance: a 256 × H overworld with the world map's rows in the bands, and black past its last row where it does not wrap.
- **T3, battle.**
  - Work: the arena from the field canvas in the bands (rows keep the battle HDMA's shift of their nearest arena row), with
    the battle sprites and effects plotting into band rows. `battle.c` has 6 sites.
  - Acceptance: a battle at 256 × H, with the HUD strip kept at its SNES place in the view.
- **T4, cutscenes and title.**
  - Work: the $FD sequence pictures (`seq_pic`, `seq_ppu`) and the title's mode-7 (`title_intro`, which already renders past
    256 columns for the widescreen).
  - Acceptance: each at 256 × H, or letterboxed where the scene has no rows to show.
- **Menus** stay at 224, centred.

## 6. Risks

- **Upstream pin bumps.** Any edit near an anchor breaks the build, loudly, by design: the error names the triple. A future
  bump costs a re-anchor pass.
- **Objects waiting off-camera.** An object the ROM parks above or below the view, waiting for a scene, becomes visible in
  the bands. The widescreen already lives with the same effect at the sides.
- **The straight-line invariant.** `g_ft` is set and reset beside `g_fw`. A `continue` or `break` between them would leave it
  set, exactly as upstream relies on for `g_fw`. The final free uses the base pointers, so even that path frees correctly.
- **Masks smaller than the screen.** A room whose mask is shorter than 224 shows black inside the view's bottom rows ≥ 211
  where the SNES blanked them anyway, and black bands.
- **The host's canvas size.** The presenter follows the picture unless `/ck_frame_size.txt` fixes a size. A host that writes
  a 224-high size squashes the tall picture. The bridge must size its canvas 256 × H when `tall_lines` is set (follow-up work
  for the app side).
- **Pointer arithmetic.** Band offsets are computed with `ptrdiff_t` or int indices from a pointer inside the allocation,
  never `size_t` with a negative row.
