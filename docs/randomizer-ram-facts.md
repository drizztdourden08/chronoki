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
