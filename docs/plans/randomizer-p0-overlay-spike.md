# Randomizer P0: the overlay spike (I-73)

**The question.** Can a seed be applied as byte edits to a copy of the player's imported pack at load time, with the
engine source untouched? (plans/randomizer-plan.html: "overlay at load" line 279, the guard line 280, the P0 gate and
fallback line 301, P0 line 442.)

**Verdict: GO on the code, to be confirmed by one hidden run** of `core/wasm-build/spikes/overlay-spike.mjs`. The engine
reads chest records straight from the pack every time it probes a chest. It reads a location's script from the pack every
time it builds that location. Nothing hashes or checksums the pack's content, and the save-state stamp has no pack hash.
The SHA-1 check covers ROM files only. Belthasar paths below are under `core/belthasar/src/` (pin v0.13.0-preview,
read-only, never edited).

## 1. How the pack is built and read

- **Import** (packages/asset-extraction). `rom/verify-rom.ts` checks the ROM's SHA-1 once, at import. The extractors then
  write a CTAS container (`ctas/ctas-builder.ts`, `ctas.constants.ts`):
  - the header is `"CTAS"`, u32 version, u32 count;
  - then 16-byte entries `{u32 type, u32 id, u32 offset, u32 length}`;
  - then the blobs.
- **Kinds of entry**:
  - T_SCRIPT = 16: the decompressed script, id = script index (`extract/pack-scripts.ts`).
  - Scene header = 3: 14 bytes, id = location. The script index is `hdr[8] | hdr[9] << 8`.
  - T_LZ = 36: id = ROM offset; blob = u32 length + 8 cost bytes + data, so the data starts at +12 (`extract/pack-lz.ts`).
  - T_TABLE = 37: id = the ROM offset where the table starts; the bytes are raw ROM.
- **The treasure table** `[0x35F000 .. 0x350000 + max pointer]` is packed as a T_TABLE (`extract/closure/closure-location.ts:83`).
  `pack-tables.ts` may merge neighbouring spans, so the entry that covers it can start below 0x35F000.
- **kit-json** (`cli/kit-json-main.ts`) bundles Belthasar's recipe texts and manifests for the importer. It is used at
  import time only; the core never reads it. The player's `ct_assets.dat` has the tables merged in
  (`write-player-assets-stage.ts:10`).
- **Load.**
  - `field.c:9994` calls `CtAssetsOpen(path)`. `assets.c:11-35` checks the `"CTAS"` magic and that every blob lies inside
    the file, and nothing else.
  - With no ROM, `field.c:10110-10136` runs `CtAssetsRomFree`, then `CtBattleUseEmptyRom` (an empty 4 MB image), then
    `CtRomViewUse(&assets)`.
  - `romview.c:17-32` collects the T_TABLE entries as pointers into the pack's heap copy, with no copy made.
    `romview.c:47-56` serves a ROM offset from the last table that starts at or before it (tables can overlap).
    `romview.c:111-116` is `CtRomByte`.
- **Chests.**
  - The notes are at `field.c:6043-6061`. `CT_TREAS_TAB` 0x35F000 holds 513 u16 pointers, and `ptr[0]` is the base.
    `CT_TREAS_BANK` is 0x350000.
  - Each record is 4 bytes:
    - u16 tile = `(y << 8) | x`;
    - u16 payload: bit 15 means gold (amount = payload << 1), bit 14 means nothing, otherwise the item is `& 0x1FF`;
    - a record with word0 = 0 is an alias, and its word1 names the location to use.
  - `fieldTreasureList` (`field.c:6066-6092`) reads every byte through `CtRomByte` on each call. The record index is
    `(off - base) / 4`.
- **Scripts.**
  - `field.c:6488` loads `CtAssetGet(a, CT_ASSET_SCRIPT, si)` at every location load, with `si` taken from the scene header.
  - `CtSceneCreateIn` (`ct_vm.c:3557-3577`) copies that blob into the private `sc->raw`, which the VM executes from
    `raw + 1 + header`. It also copies the blob into WRAM 7F:2000.

## 2. Where the items live

- **Chest.**
  - The item is the record's payload word, at ROM `0x350000 + off + 2`.
  - The opened bit is `glb[1 + ((idx >> 3) & 0x3F)]` bit `idx & 7` (`field.c:6095-6102`). In the flat WRAM image that
    is byte `0x10001 + ((idx >> 3) & 0x3F)`.
  - `fieldTreasureProbe` (`field.c:6292-6358`) runs only when `s7[0x129] == 0` and `s7[0x11F] != 0`. It finds the faced
    tile from `px` and `py` (12.4 position / 16) and `pfac & 3`: up tries 1 tile ahead, then 2; down, left and right try
    1 tile. The record's tile must match exactly. The probe then sets the bit, awards the item and, with `CT_CHESTDBG`
    set, prints a `chest: loc .. idx .. payload ..` line.
  - `fieldAddItem` (`field.c:6170-6182`) accepts item ids 1 to 0xFF only.
- **Gift.**
  - The add-item op is `CA ii` (2 bytes; `ct_vm.c:49-78` OPLEN, the item family at `ct_vm.c:2901-2913`). The operand
    byte sits inside the location's T_SCRIPT blob.
  - It can be found by event and offset, without a disassembler:
    - the event is the script index `si` from scene header `loc`;
    - object `o`'s function `f` starts at body offset `u16(raw, 1 + o*32 + f*2) - header` (`ct_vm.c:1618-1621`), where
      `header = raw[0] * 32`;
    - walk with `opLen` from each distinct start to the next one;
    - the operand of a `CA` at body offset `a` is at blob offset `1 + header + a + 1`.
  - Any T_LZ entry whose data at +12 is byte-identical to the script carries the same bytes, and gets the same edit.

## 3. Does an edited copy load?

Yes, as far as the code shows. The checks that exist are listed here; none of them reads the pack's content.

| Check | Where | Sees the overlay? |
|---|---|---|
| CTAS magic, blobs in bounds | assets.c:11-35 | no (same-length edits) |
| ROM SHA-1 | battle.c:34-62 (`CtRomVerify`, rom_verify.h:8), verify-rom.ts | no: ROM files only, never the pack |
| Table-set and layout hashes | datapack.c:68, 99, 152-154 | no: compile-time type layouts |
| State stamp (pin, core, schema) | state-stamp.mjs, ck_state.c:160-180 | no: no pack hash |

A state saved before an overlay still loads with the overlay applied:

- A load from another location runs `fieldLoad` from the pack (`ck_host_point.inc:29-68`), then `CtSceneLoadState`.
- `CtSceneLoadState` keeps the live `sc->raw` (`ct_vm.c:6707-6761`), so the VM runs the overlaid script.
- WRAM 7F:2000 keeps the state's vanilla copy. Only oracle seeding reads it (`SeedFromWram`, `ct_vm.c:3831`), so the
  difference is harmless.
- Chests always read through the overlay.

## 4. WRAM, and whether P0-a is still needed

- `CkWramPtr` (core/wasm-build/ck_info.c, through `--wrap=CtWramCreate`) returns the flat 128 KB image: $7E at +0,
  $7F at +0x10000.
  - The inventory ids are at +0x2400 and the counts at +0x2500 (0xF2 slots).
  - The chest bits are at +0x10001.
  - The location is `u16 @ +0x100 & 0x1FF`.
- **P0-a's `CkRamPtr`/`CkRamSize` are not needed**: `CkWramPtr` is the same pointer, and the size is fixed at 0x20000 by
  the layout assert (`ct_vm.c:105-113`). `CkRamWrite` is a P5 (live sync) policy choice, not a P0 need. The plan's
  ck_memory.c (line 306, P0-a line 474) can be dropped. If a size export is ever wanted, add it to ck_info.c.

## 5. The overlay design

- **The seed** becomes a placement, and the placement becomes edits. A table edit has the shape `{rom, old[], new[]}`;
  a script edit has the shape `{script si, offset, old[], new[]}`. All edits keep the same length.
- **Resolving to assets.**
  - A ROM edit resolves to every T_TABLE (37) entry that covers the bytes, because spans can overlap.
  - A script edit resolves to T_SCRIPT (16) `si`, plus every byte-identical T_LZ (36) copy.
  - The result is a list of `{asset: {type, id}, offset, old, new, why}`.
- **Applying** (`SeedApplier.apply`, randomizer-brock-plugin-analysis.md:165-168):
  1. Copy the pack.
  2. Check every edit's old bytes against the copy.
  3. Only then write them all.
  4. One mismatch refuses the whole overlay and names the edit's `why`. Nothing is written, and the vanilla pack and the
     asset cache stay untouched.
- **The app seam.** `apps/desktop/src/storage/assets-store/load-assets.ts` is unused (the analysis' P3 reference to it is
  stale). The live path is brock-port-kit `create-port-session.ts:20-22`: `createAssetCache(...).load(romFile)`, then
  `core.start({assets})`, then `write-boot-files.ts:18` writes `/ct_assets.dat`. P3 adds a port-kit `transformAssets`
  option (or a files wrapper) at that step, which applies the overlay to a copy.
- **Limits found.**
  - Items above 0xFF cannot be awarded (`field.c:6171`), so the item pool is 1..0xFF.
  - A gift's dialogue may name the vanilla item through a separate text operand. That is P3 work.
  - The overlay is fixed at boot, so a new seed means a new session.
  - Opcode-length risk (plan line 294): none, because edits never change a length.

## 6. Hidden-run acceptance (the launcher)

**What the run needs.**

- The built glue. The script tries, in order: `--glue`, the worktree's `core/wasm-build/out/chronoki.js`, the main
  checkout's `X:/chronoki/core/wasm-build/out/chronoki.js`, then `apps/desktop/public/wasm/chronoki.js`.
- The player's pack.
- A field quick-save, in free control, standing still, facing a chest or open floor.

**Command** (no window; Node only; `--experimental-wasm-jspi` is added by the script itself):

```
node core/wasm-build/spikes/overlay-spike.mjs --pack "X:/chronoki/.user-data/Data/assets/Chrono Trigger (USA).dat" --state "X:/chronoki/.user-data/Data/profiles/main/saves/quick/save0.sav"
```

Optional: `--gift-state <a .sav standing before an NPC who gives an item>` with `--gift-inputs "A,120,A,120"` (button,
frames, ...), and `--chest-item` / `--gift-item` to pick the items.

**What the script does.**

1. Reads the state's location, position and facing, then plans the edits.
   - Chest: if a record sits on the faced tile, only its payload changes (mode `real`). Otherwise an unopened record is
     moved onto the faced tile (mode `relocated`, a spike shortcut only).
   - Gift: every `CA` operand in the location's script changes.
   - The items are unheld ones from 0xD7..0xE3.
2. Self-tests the guard: one wrong old byte must refuse everything.
3. Boots the core on the copy with `CT_CHESTDBG=1`, loads the state and presses A.

**Pass.**

- The exit code is 0 and the last line is `RESULT chest=PASS gift=PASS guard=PASS`.
  - `chest=PASS`: the placed item's count rose by 1, the chest's bit went 0 to 1, no other chest byte changed, and the
    vanilla item was not given. A `chest:` line from the engine confirms it.
  - `gift=STRUCT-PASS` (no `--gift-state`): the edited script window was found in the core's heap at least once more
    than the pack copies, which shows the scene runs the overlay. The behavioural `gift=PASS` needs `--gift-state`.
  - `guard=PASS`: the bad edit was refused.
- Other exit codes:
  - 3: chest and guard passed, but the state's location has no `CA` op (gift `SKIP`). Rerun with a gift-location state.
  - 2: setup (the state did not load, or the state is not a field state; the JSON line says why).
  - 1: a check failed.

**Recording the result.** Record go/no-go on I-73 (`coord decide`). On no-go, cost the fallback from plan line 301:
overlay before import, one pack per profile.

**The script's place.** It lives at `core/wasm-build/spikes/` in the repo, not in a scratchpad, for three reasons: the
launcher runs in its own worktree and cannot see this session's scratchpad; `core/wasm-build/probe/*.mjs` is the
precedent for headless tools that read player data at run time; and it holds no game data, only offsets and logic.
Delete it when P3's overlay lands.
