# Randomizer RAM and boss facts

Moved out of source comments (local/no-comments). Engine references are in `core/belthasar/src`.

## Start magic grant (session/start-magic-grant.constants.ts)

| Fact | Evidence |
|---|---|
| `$7F01E0` is the magic gate: a tech whose CC/1BEB record has bit 7 is learnt only if `(1 << charId) & $7F01E0` | battle.c:14531-14533 (C1/F482-F49A), battle.c:198, 14759-14761 |
| `$7E2837+charId` is the learned-tech bit mask (MSB first) read by the tech menu and the battle list | menu.c:3165, move.c:644, battle.c:5577 |
| `$7E2830+charId` is the tech level the learn pass advances | battle.c:14525 |
| Sheet `+0x2D` is the TP still owed for the next tech (reloads from CC/26FA) | battle.c:193-194, 14531-14540 |
| `CtMenuNewGameWipe` copies all seven sheets plus `$2830-$287F` from the ROM once, at New Game; a join only sets the roster, so one write after New Game survives every later join | menu.c:4167-4168, move.c:532 |

Values are what Spekkio's teach scene (location 0x1D1, object 9, fn 3) writes for Crono, Marle, Lucca and Frog.

## Start flags (apply/start-state/option-start-flags.constants.ts)

- Early pendant: the game's own sealed-chest scripts test the bit (checks/sealed-pendant.constants.ts).
- Unlocked magic start flags are empty on purpose (I-111): the Spekkio state is too big for the 103-byte start block, so it is written after New Game by session/create-start-magic-grant.ts.

## Start block (apply/start-state/start-block.constants.ts)

The block is spliced at the intro jump (offset 226). The earlier 0x16 jump at offset 77 has displacement 152 and must still reach offset 233: 152 + (blockLength - 5) <= 255, so blockLength <= 108.

The New Game flag shows while the game is still at location 0x000, before scene 0 reaches the block, so the start read-back (session/create-start-state-check.ts) waits for the warp location itself, only on a fresh New Game, and reports a mismatch with a toast after 30 polls without the warp.

## Start gold (session/create-start-gold-grant.ts)

The game writes its own starting 400 gold about 10 frames after the new-game flag shows (headless run: flag at frame 283, write at 293), so the grant waits for non-zero gold (or a poll limit) before writing.

## Boss enemy ids (apply/enemy-difficulty/boss-map.constants.ts)

Enemy ids are battle table indexes.

| Key-item spot | Boss | Ids |
|---|---|---|
| ki-taban | Heckran | 169 |
| ki-kings-trial | Dragon Tank (body, grinder, head), Yakra XIII | 147, 148, 173, 199 |
| ki-mt-woe | Giga Gaia (head, hands) | 209, 210, 211 |
| ki-arris-dome | Guardian and its bit | 212, 207 |
| ki-zenan-bridge | Zombor (controller, parts) | 179-182 |
| ki-denadoro-mts | Masa, Mune, Masa & Mune | 151, 152, 153 |
| ki-sun-palace | Son of Sun and its flames | 246, 247 |
| ki-geno-dome | Mother Brain and its displays | 190, 183 |
| ki-sunken-desert | Retinite | 58 |
| ki-giants-claw | Gigasaur | 170 |
| ki-ozzies-fort | Flea Plus, Super Slash, Great Ozzie | 160, 165, 168, 186, 187 |
| ki-reptite-lair | Nizbel | 155 |

Bosses that guard no key-item spot (never treated as regular enemies): Yakra 144, Golem 149, Azala 154, Nizbel II 156,
Slash 157-158, Flea 159, Dalton 161-162, Metal Mute 164, Ozzie 166-167, Black/Rust Tyrano 188-189, Atropos XR 192,
Golem Boss 243, Magus 249-250.

## Multiworld engine hooks (core/reconnect/ap_reconnect.c, wasm-build/patches/ap-*.mjs)

Every hook is gated by `ck_ap_online()` (death link also by `ck_ap_death_link()`); off, the patched sites run the original code.

| Fact | Evidence |
|---|---|
| CT item ids run 0x01..0xF1, so the foreign-item sentinel is 0xFE (RotP's `FOREIGN_ITEM_ID`) | treasure-tiers.constants.ts `LAST_ITEM_ID` |
| A chest's opened bit is `$7F:0001 + (idx >> 3)` bit `idx & 7`; the award sets it before the payload decode (gold, "award nothing", item) | field.c:6322-6324 (C0/1E44-1E46) |
| An item chest's id is `payload & 0x01FF`, stored to `$7F:0200` (local 0), then given by `fieldAddItem` (C1/8003 leaf 1) | field.c:6336-6338 (C0/1E66-1E70) |
| The chest text's `{item}` (code 0x1F) is the item's name from `CtMenuItemName`, as ASCII | field.c:6256-6260, 6350 |
| Chest records are numbered per location in ROM order (`chest-LLL-n`); the probe's `r` is that record index, `idx` the flag index | field.c:6312-6320, derive-chest-checks.ts |
| Op 0xCA (add item, C0/37B1): operand = the id; spill `$01C7` = ip + 2; leaf 1 (C1/D005) via the C1/CFC2 gate, which first writes `$AEF7` = id; exits at the spill | move.c:459-490, move.c:373-387 |
| The live VM runs the item family at two sites only: runFunc's init pass and the step (`CtFieldRunnerOne`'s call is tools-only) | ct_vm.c:1186, ct_vm.c:2911, move.c:4065 |
| A gift's `patchAt` (gift-LLL-oN) is the 0xCA operand's offset in the script entry = 1 + header + body ip + 1 | walk-script-ops.ts, ct_vm.c:3572-3574 |
| The textbox `{item}` (code 0x1F, C2/5B9B) reads local 0 (`$7F:0200`) and draws CT charset bytes (0xA0-0xF3, ' ' blank) | ct_vm.c:6611-6624, field.c:6200-6212 |
| The current location is `$7E:0100` (word, & 0x1FF) | field.c:5067 |
| Battle game over is committed when outcome 1 finds `$2A1F` bit 5 clear (C0/02A0 defeat sequence) | field.c:8852-8859 |
| The field's defeat sequence runs from main's `gameOver` local (goPhase a/b, then the cold reset) | field.c:10984-10985, 16016-16027 |
| PC battle blocks: `kPcBlock = { $5E2D, $5EAD, $5F2D }`, curHP at block + 3/+4; a present seat has `$2980 + seat` bit 7 clear | battle.c:618, battle.c:15255-15260 (CT_BATTLE_PCHP) |
| The dead-flag sweep (C1/B223) marks fallen PCs and latches `$24` = 1 when all three are down | battle.c:15061-15079, battle.c:20834 |
| CT's save is 8 records, 0x0834 bytes, per 0x0A00 slot (bases 0x0000/0x0A00/0x1400); the checksum (FF/FBE7) covers the whole slot | menu.c:4001-4012, menu.c:4046-4078 |
| Slot +0x0834..+0x09FF (0x1CC bytes) is written by no CT code, not loaded, not read by the summary: the multiworld tail lives at +0x0834 | menu.c:4046-4078, 4111-4134 |
| "Save #" (`$7E:299C`) is bumped on every save and lands at slot +0x059C (record 0) | menu.c:4050-4056 |
| No byte inside the saved WRAM records is provably spare without a script-wide scan (`$7F:0000-01FF` flags are script-addressable) | menu.c:4001 (`$7F0000` + 0x200) |
