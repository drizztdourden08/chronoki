/* @layer bridge-wasm @kind constants */
import { SHEET_BASE, SHEET_STRIDE, WRAM_BANK_7F } from '../../game-info/wram-map.constants';

// Engine evidence (core/belthasar/src, the game's own C2/C1 code ported):
// - battle.c:14531-14533 (C1/F482-F49A): a tech whose CC/1BEB record has bit 7 (magic) is learnt only if
//   (1 << charId) & $7F01E0, so that byte is the magic gate; battle.c:198 and 14759-14761 say the same.
// - menu.c:3165, move.c:644 and battle.c:5577: $7E2837+charId is the learned-tech bit mask (MSB first) the tech menu
//   and the battle list read; battle.c:14525: $7E2830+charId is the tech level the learn pass advances.
// - battle.c:193-194 and 14531-14540: sheet +0x2D is the TP still owed for the next tech (it reloads from CC/26FA).
// - menu.c:4167-4168 (CtMenuNewGameWipe) copies all seven sheets plus $2830-$287F from the ROM once, at New Game;
//   move.c:532 (a join) only sets the roster, so one write after New Game survives every later join.
// The values are what Spekkio's teach scene (location 0x1D1, object 9, fn 3) writes for Crono, Marle, Lucca and Frog.
const MAGIC_GATE_AT = WRAM_BANK_7F + 0x01e0;
const MAGIC_GATE_BITS = 0x5f;
const TAUGHT_CHARACTERS: readonly number[] = [0, 1, 2, 4];
const TECH_LEVEL_AT = 0x2830;
const TECH_LEVEL = 3;
const TECH_BITS_AT = 0x2837;
const TECH_BITS = 0xe0;
const TP_NEXT_OFFSET = 0x2d;
const TP_NEXT_DEFAULT = 0x03a0;
const TP_NEXT_MARLE = 0x0396;
const MARLE = 1;

const tpNextAt = (id: number): number => SHEET_BASE + id * SHEET_STRIDE + TP_NEXT_OFFSET;
const tpNextOf = (id: number): number => (id === MARLE ? TP_NEXT_MARLE : TP_NEXT_DEFAULT);

export {
  MAGIC_GATE_AT, MAGIC_GATE_BITS, TAUGHT_CHARACTERS, TECH_BITS, TECH_BITS_AT, TECH_LEVEL, TECH_LEVEL_AT, tpNextAt, tpNextOf,
};
