# Tall rendering: an engine patch (I-74)

Owner decision, 2026-11-04: build true tall rendering, meaning a picture of more than 224 lines with real extra rows above and
below the SNES view, as an engine patch. The owner later asked for full support ("if we can do it in rotp, no reason we can't
here as well"): every scene, render scale, frames between, and widescreen plus tall together, as RotP does.

- It is gated. With the gate off, the engine is unchanged byte for byte, and no save-state section changes.
- It is developed and tested in its own worktree before it reaches main.
- The engine changes only through build-time exact-match patches (`core/wasm-build/patches/tall-field.mjs`) and files under
  `core/reconnect`. `core/belthasar` is never edited.

Related: `docs/plans/aspect-ratio-parity-plan.md` section 3 (why tall was split out) and the widescreen's `wide_width`
(`ck_wide_width`, the hostWideW patch in `state-patches.mjs`).

## 1. Approach: a wrap at the upload

T1 (the first version of this patch) made the field compositor draw a taller picture and letterboxed every other scene, with
render scale forced to 1x, no frames between and no widescreen. That shape could not grow to the other scenes: the frames
between, the render scale and the widescreen's assembly all assume a 224-line picture, so each would have needed its own
tall path.

The current design keeps every scene's own 224-line picture through the whole pipeline, and adds the rows at the very end.

- **Every picture stays 224 lines.** The field, the overworld, a battle, the title, a menu: each is composed, scaled by the
  render scale k, interpolated and widened exactly as with tall off.
- **The upload wraps it.** `hostUpload` calls `ckTallWrap` (`ck_tall_host.inc`) first. The picture `w x h` goes up as
  `w x (h + 2 T k)`, with `k = h / 224` and the 1x width `W1 = w / k`. The picture is unchanged in the middle; the band rows
  above and below come from one of three sources:
  1. **The title's mode 7** (`g_hostTi` set and its mode is 7): `CkTitleIntroRenderBands` (`ck_tall_title.inc`) samples the
     plane for the band rows at the same sub-pixel walk and the same frames-between lerp as `CtTitleIntroRenderEx`.
  2. **The band store**, which a producer filled for the frame being presented (the field, the overworld, a battle). It is
     scaled to k by nearest neighbour and dimmed by the store's brightness. In a frame between (`t < 256`), the store is moved
     by the camera's shift at t (`CtMotCamShift`), as the frames between move the map.
  3. **Black**, for every scene with no rows to show (section 5).
- **The band store** (`ck_tall_defs.inc`) holds, for a picture `W` wide, the rows `-T .. E-1` (top) and `224-E .. 224+T-1`
  (bottom), `E = CK_TALL_EDGE = 32`. The `E` rows inside the view are the margin a shifted band row reads in a frame between.
  Rows are stored before the brightness, with the field's wipe already applied. A producer calls `ckBandBegin(W, T)`, fills
  the rows, then calls `ckBandEnd(bright)`, which marks the store pending. `hostPresentMot` starts with
  `ckTallPresentBegin()`, so the bands shown are the ones stored for that present. A present that no producer filled shows
  black. The pause redraw uploads again without a present, so it keeps the bands it had.
- **The frames between** shift the bands only between two valid motion frames of one scene, one width (`== W1 == W`), and a
  camera move of at most 32 pixels (the overworld's measured across its 1536 x 1024 wrap). Otherwise the frame's own bands
  are shown unmoved.

## 2. The gate and the frame size

- **The setting.** `[video] tall_lines` in `ct_settings.ini` is read by `core/reconnect/settings_reconnect.c` and returned by
  `ck_tall_lines()`. Unset, 224 and out-of-range values mean off (224). Otherwise the value is made even, up to
  `CK_TALL_LINES_MAX` (480).
- **`hostTallT()`** returns the band rows a side, `(lines - 224) / 2`. It returns 0 (off) when the run is headless (the suite
  and the oracle never see tall) or when the option is off. **It combines with the widescreen**: the picture is then
  `wide_width x tall_lines`.
- **Off is exact.** With `hostTallT() == 0`:
  - `ckTallWrap` returns the picture it was given;
  - `g_ft`, `g_ckTallT` and `g_owBandDy` stay 0, so every inserted branch is skipped, every offset is `+ 0` and every loop
    runs over `0 .. 224`;
  - the battle and overworld producers are not called;
  - the patched `world.c` limit is `-15 - 0 .. 223 + 0`;
  - the title copy only adds a function.

  The rest is larger static buffers. No state section reads or writes any tall variable, so the save-state layout is the
  same with the gate off or on (I-77's versioned states are unaffected).
- **Why the cap is 480.** 480 lines is 224 + 2 × 128, RotP's own vertical budget (`kPpuExtraTopBottom = 128`, `MIN_ASPECT`
  256/480). At 544 × 480 × 3, each grown static frame buffer is about 783 KB.

### The frame-size contract (for the app)

- `CkViewWidth()` / `CkViewHeight()` (new exports, `ck_api.c`) report the 1x picture the options ask for:
  - `W = wide_width`, or 256 when the widescreen is off;
  - `H = 224 + 2 T`, which is `tall_lines` when it is in range, else 224.
- `CkFrameWidth()` / `CkFrameHeight()` report the actual RGBA frame: `W k x H k`, with k the render scale (4 while
  interpolating at 1x). Every upload is wrapped, so with the options fixed the frame size is the same in every scene (field,
  overworld, battle, title, menus, sequences).
- **The host sets `H` from the display ratio.** For a target picture ratio `A` (width / height on screen) and pixel aspect `p`
  (1 for `aspect=pixel`, 8/7 for the SNES's 4:3):
  - a ratio narrower than `256 p / 224` asks for tall: `tall_lines = clamp(even(round(256 p / A)), 224, 480)`;
  - a wider ratio asks for wide: `wide_width = round(224 A / p)`, as today.
  - Both can be set together. The picture is then `wide_width x tall_lines` (RotP's extended both ways), and the app sizes
    its canvas from `CkViewWidth x CkViewHeight` (times its window scale), or from `CkFrameWidth x CkFrameHeight`.
- **A host that fixes the canvas to 224 lines** (`/ck_frame_size.txt`) squashes the tall picture. The app must follow the
  reported size; that work belongs to the app-side agent.

## 3. The producers

| Phase | Scene | Producer | Where |
|---|---|---|---|
| T1 | field | the compositor draws the bands in the same pass into the tall `g_wfb` (map from `f.base`, sprites, foreground, black past the room); `ckTallFieldBands` stores them with the wipe | `ck_tall_field.inc`, BEGIN/END, TALL_BRANCH |
| T2 | overworld | `ckTallOwBands`: two partial composes of a copy of the World, the scroll moved by `-T` and `224 - E`, from a picture-only tilemap round the moved camera; the OBJ layer from the frame's uncut pieces (`wideShow`), which the patched `world.c` keeps up to the band rows | `ck_tall_ow.inc`, OW_* triples, `world.c` triple |
| T3 | battle | `ckTallBattleBands`: the arena map (`f.base`) at each side's nearest arena row's battle scroll (the shake, a line wave), black past the room, then the crit flash; the screen's brightness (`$2100`) | `ck_tall_field.inc`, BATTLE triple |
| T4 | title | mode 7 drawn for the band rows (`CkTitleIntroRenderBands`, appended to the build's copy of `title_intro.c`) | `ck_tall_title.inc` |

The field's picture with the widescreen on is `g_fw = wide_width` columns; the bands are that wide, black past the room's
sides (`ckTallInCols`). A battle at 256 inside a wide picture (no wide arena) is centred, with black sides.

### The room edge

The SNES never shows a row past the room: the camera stops at the scroll mask (`Field.my0` / `my1`) and the V-IRQ blanks lines
211–223. A band row whose map row lies outside `[my0, my1)` is black, and so is a view row ≥ 211 outside it (`ckTallInRoom`).
Sprites still draw over black rows, as the widescreen's sides do. When the mask is taller than the map, the camera wraps the
map itself, and there is no edge. Inside the room, rows 211–223 are drawn while tall is on (the bottom-lines mod). This matches
RotP's default (a black band past the room); RotP's camera lock is an optional setting.

## 4. The triples

`tall-field.mjs` holds 37 triples on `field.c`, 1 on `world.c`, and the `title_intro.c` copy. Each triple has count 1.

- **field.c, shared:**
  - the include of `ck_tall_defs.inc`;
  - `g_wfb` and `g_wide` sized for the cap;
  - `hostUpload` calls `ckTallWrap` first;
  - before `hostUploadPictureAt`: the includes of `ck_tall_host.inc` and `ck_tall_ow.inc`, and `g_ckUpT = t`;
  - `hostPresentMot` starts with `ckTallPresentBegin()`.
- **field.c, T1 field:**
  - `plot` and `drawSprite` band rows;
  - the include of `ck_tall_field.inc`;
  - `front` and `pmask` sized for the cap, with their base pointers kept;
  - compose start (`g_ft` from `hostTallT()`, wide or not; `fb`, `front`, `pmask` offset by `g_ft * g_fw`);
  - the memsets;
  - `ckTallMap`;
  - the three unlatched-objects sites;
  - the foreground's blank rows;
  - `ckTallFg`;
  - compose end (the view rows back unless the widescreen already copied them; `g_ckTallW = g_fw`);
  - the motion record's picture and `fieldWideAssemble` read `g_wfb + g_ckTallT * wideW * 3`;
  - the IRQ blank;
  - `ckTallFieldBands` before the widescreen assembly;
  - the `g_ckTallT` reset;
  - the frees.
- **field.c, T3:** the battle producer after the widescreen arena.
- **field.c, T2:**
  - `g_owBandDy`, `g_owY0`, `g_owY1`;
  - the OBJ piece row `y + g_owBandDy`;
  - HDMA off in a band compose;
  - the four compose loops over `g_owY0 .. g_owY1`;
  - pieces (not the OAM line) in a band compose;
  - window 1 off in a band compose;
  - `ckOwBands` before `CtMotBegin`, because the band composes share `CtWorldTilemapView`'s static map, which the widescreen
    compose rebuilds next;
  - `ckTallWipe` / `ckBandEnd(owBri)` before the overworld's present.
- **world.c:** the pieces' row limit, widened by `ck_tall_rows()`.

## 5. Scenes with no rows to show: black bands

These scenes draw black bands, at the full frame size, with the view centred:

- the title's non-mode-7 phases (the mode-2 TRIGGER logo, the tiled screens);
- the $FD sequence stages (the race, the endings, entries 3, 4, 6 and 7);
- the gate warp;
- the menus: the C2 menu, shops, save, the loader, naming, the ATB selector;
- game over;
- the overworld's time gauge and world map (mode 7) and their NMI-off stretches;
- overworld loading;
- any present no producer filled.

## 6. Phases and per-phase acceptance (hidden launcher run)

Every check runs hidden (own user-data folder). "View rows" means rows `T k .. (T + 224) k - 1` of the frame. In the field,
rows 211–223 of the view are drawn while tall is on (section 3), so a view comparison against a gate-off frame excludes them.

- **Gate off (identity), first.** With `tall_lines` unset (and again with `tall_lines=224`), at the same save states and
  frame counts as a main build (field room, overworld, battle, title swing, a menu), the frames must be byte-identical to
  main's. `CkViewHeight() == 224` and `CkFrameHeight() == 224 k`. A save state written by this build loads in main's build,
  and the reverse, with the same stamp and schema hash.
- **T1, field** (`tall_lines=320`, so T = 48):
  - The frame is 256 × 320 at k = 1 and 512 × 640 at k = 2; `CkViewWidth/Height` are 256 / 320.
  - The view rows are the unchanged picture, and the bands hold map rows.
  - Rows past the room's top and bottom are black, with no next-room bleed.
  - Sprites cross the view's edges without clipping.
  - A fade dims the bands with the view, and a wipe closes over them.
  - With interpolation on, the bands move with the camera during a pan, with no seam at rows `T k` and `(T + 224) k`.
- **T1 with the widescreen** (`wide_width=400`, `tall_lines=320`): the frame is 400 × 320. The bands are 400 wide, black past
  the room's sides.
- **T2, overworld:**
  - The frame is 256 × 320 (or 400 × 320 with wide), with the world map's rows and its objects (the lead, boats, birds) in
    the bands, and the map wrapping vertically.
  - Opening the time gauge or the world map gives black bands.
  - Walking across the wrap gives no jump in the bands.
- **T3, battle:**
  - The frame is 256 × 320. The arena continues above and below, and the HUD sits in its SNES place in the view.
  - The bands shake with the arena's screen shake.
  - The crit flash whitens them.
  - The battle's fade-out dims them.
  - With wide, the frame is 400 × 320 with the wide arena in the bands.
- **T4, title:**
  - The mode-7 swing continues into the bands, at k = 1 and at k = 2, and with interpolation (no stepping).
  - The TRIGGER logo phase shows black bands.
- **Black-band scenes (section 5):** each one keeps the same frame size as the field (no size change on a scene switch),
  with black bands.

## 7. What stays excluded, and why

- **The vertical view hold** (moving the view inside the tall picture at a room's edge so the bands show more room instead of
  black, like `fieldWideViewX`). It moves the 224 view itself, which would change what the frames between and the overlays
  assume. It is left for later.
- **In the field's bands:**
  - the BG3 caption plane, the iris and colour windows, and sub-screen sprite math (their line tables cover the 224 view
    rows);
  - the occluder stencil (a priority-0/1 sprite pixel shows the map pixel);
  - the widescreen's Steam margins and beyond layers (black past the room's sides instead).
- **In the overworld's bands:**
  - HDMA's per-line scroll (the waves) and window 1 (their tables cover the SNES's 224 lines);
  - the mosaic, which is taken on the band compose's own grid;
  - BG3's per-line H scroll, read at the band compose's line.

  The bands cost two extra partial composes, `2 (T + 32)` rows.
- **In the battle's bands:** the combatants, BG3's effects and the flee mosaic. The SNES draws none of them past its lines;
  the arena alone continues. The battle camera is static, so there is no shift in the frames between.
- **In the title's bands:** sprites (none past the SNES's lines), and a per-line matrix holds its first or last line's value.
- **In a frame between:** the bands move with the camera, but the sprites in them stay at frame N's place. The bands are
  upscaled to k by nearest neighbour; the view itself is drawn natively at k.

## 8. Risks

- **Upstream pin bumps.** Any edit near an anchor breaks the build, loudly, by design: the error names the triple.
- **Objects waiting off-camera.** An object the ROM parks above or below the view becomes visible in the bands. The
  widescreen already lives with the same effect at the sides.
- **The straight-line invariant.** `g_ft` is set and reset beside `g_fw`. A `continue` between them would leave it set,
  exactly as upstream relies on for `g_fw`. The final free uses the base pointers.
- **Pointer arithmetic.** Band offsets use `ptrdiff_t` or int indices from a pointer inside the allocation.
- **The overworld's band composes** run on a copy of the World (the compose keeps pose counters on it), with the motion
  record and the native frames-between recorder detached, before the frame's own compose (they overwrite the compositor's
  statics, which the frame's compose then rewrites in full).
