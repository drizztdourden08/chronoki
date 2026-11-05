// Build-time text patch for the battle (src/battle.c, on top of sightscope's copy) and the field loader (src/move.c):
// [chronoki] duplicate characters (ck_dup_chars(), I-115; the design's section 2b/2c rows B1-B19, V2, V4). Exact matches
// with an expected count; any mismatch stops the build (the sightscope.mjs precedent). core/belthasar is never edited:
// the copies go under out/gen/dupchars/.
//  * Identity model: a party byte ($2980.., $AEFF..) is the SLOT (story identity: sheet, names, TP, learned bits); the
//    sheet's byte +0 is the KIND (sprites, poses, attack record, tech tables, growth). ckPcKind(wram, slot) reads it.
//  * Every patched expression is `ck_dup_chars() ? <kind expr> : <original expression>` (or the if/else of it), so the
//    gate off compiles to the original behaviour.
//  * The input is sightscope's battle.c (its result is this one's input) and the original move.c; the result replaces
//    both in the game module: `{ patches, files, replaced }` is a drop-in for writeSightscope's result.
//
// Judgement calls (I-115, P4):
//  * The tech actor byte is $B3F4, not $B18B. ckTechSeat(s, ch) (P3, reconnect/ck_dup_chars.inc) must take the
//    commanding seat from $B3F4: C1/B9C1 `LDA $B18B / STA $B3F4` (battle.c:5145, 11067) stores the seat that confirmed
//    the command before the executor runs, and nothing writes it again during the tech. $B18B is rewritten for every
//    participant inside the executor (C1/D632, battle.c:8071) and by the damage kind (battle.c:6601), so at participant 1
//    or 2 (and in the BDB3 reload at the tech's close) it names participant 0's seat, not the commander. At the boot
//    (records) $B18B and $B3F4 are both cleared garbage, so the boot sites do not use ckTechSeat (next point).
//  * B12r 5555 (battleTechRecMp) and 5566 (battleTechSeatOf) are boot-only (their callers are all in
//    battleTechBootRecords): no ckTechSeat there. They read $B1BE[kind] plainly, which B14 sets to the seat being built.
//    The run-time B12r sites (6905, 6918, 7809, 7848, 8062) use ckTechSeat.
//  * B12: $B1BE is built by kind, the lowest seat of each kind wins.
//  * B14 boot records: singles' ids by kind (FD/A89D[kind]), learned bits by slot ($2837 + slot); $B1BE[kind] = seat
//    while that seat's records are built (so each duplicate's singles and dual MP slots point at itself), then restored.
//  * B16: $2830+ (tech level) by the slot of seat $B2D0; the CC tables (276A, 26FA) by the kind, which $B2D1 (block +0)
//    already is, so those reads need no patch. techF533 reads $2830 by kind index: the slot of the lowest seat of that kind
//    ($B1BE). The magic gate `(1 << id) & $7F01E0` (techF45F) stays on $B2D1 = the kind: it unlocks a kind's magic.
//  * B13: "not in this fight" is "the slot is not in the party bytes $2980..$2982" ($B1BE is kind-indexed now).
//  * B19: the ready pool takes `seat + 1` ($B1BE[party byte] is the seat itself in vanilla).
//  * B18: the AI co-targets are kinds (they are compared with CC:249F group characters), only for a PC seat (< 3).
//  * Extra K site, found beyond the design's list: battleLoaderPointers (battle.c:14946, CC/E97A) stages the PC battle
//    sprite gfx, assembly and pose pointers the live gather reads: by kind.
//  * V2 is patched at op 0x80's call (ctVmPcLoad, move.c:1840), not inside ctPcLoad: op 0x81 (the NPC copy) shares
//    ctPcLoad with a header index the pack already retargets to the kind.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const INCLUDE = '#include "ck_reconnect.h"\n';
const BATTLE_HELPERS = `/* [chronoki] duplicate characters (patches/duplicate-chars-battle.mjs): kind = sheet +0 of a slot (ckPcKind). */
static int ckBtKindOf(const uint8_t* s, int id) { return (id >= 0 && id < 7) ? ckPcKind(s, id) : id; }
static int ckBtKindAt(const uint8_t* s, int seat) { int id = s[(0xAEFF + seat) & 0xFFFF]; return (seat >= 0 && seat < 3) ? ckBtKindOf(s, id) : id; }
static int ckBtTechSeat(const uint8_t* s, int ch) { return (ch >= 0 && ch < 7) ? ckTechSeat(s, ch) : s[0xB1BE + ch]; }
static int ckBtSlotOfSeat(const uint8_t* s, int seat, int orig) {
  int v = (seat >= 0 && seat < 3) ? ckSlotOfSeat(s, seat) : 0xFF;
  if (v < 0 || v >= 7) v = (seat >= 0 && seat < 3 && s[0x2980 + seat] < 7) ? s[0x2980 + seat] : orig;
  return v;
}
static int ckBtSlotOfKind(const uint8_t* s, int k) { int seat = (k >= 0 && k < 7) ? s[0xB1BE + k] : 0xFF; return (seat < 3) ? ckBtSlotOfSeat(s, seat, k) : k; }
static int ckBtSeatedSlot(const uint8_t* s, int slot) { for (int k = 0; k < 3; k++) if (!(s[0x2980 + k] & 0x80) && s[0x2980 + k] == slot) return 1; return 0; }
`;
const MOVE_HELPERS = `/* [chronoki] duplicate characters (patches/duplicate-chars-battle.mjs): kind = sheet +0 of a slot (ckPcKind). */
static int ckMvKindOf(const uint8_t* r, int id) { return (id >= 0 && id < 7) ? ckPcKind(r, id) : id; }
`;

const D = 'ck_dup_chars()';

// [what to find, what to put, how many times it must occur]
const BATTLE_PATCHES = [
  // B1 battlePcAtkRecord: the attack record (formula type, Ayla 5, Frog 6) by kind
  ['int cid = (s && atkCmb >= 0 && atkCmb < 3) ? s[0xAEFF + atkCmb] : 0xFF;',
    `int cid = (s && atkCmb >= 0 && atkCmb < 3) ? (${D} ? ckBtKindAt(s, atkCmb) : s[0xAEFF + atkCmb]) : 0xFF;`, 1],
  // B12 the character -> seat map $B1BE by kind, the lowest seat wins
  ['  for (int k = 0; k < 3; k++) if (s[0xAEFF + k] != 0xFF && s[0xAEFF + k] < 7) s[0xB1BE + s[0xAEFF + k]] = (uint8_t)k;\n',
    `  for (int k = 0; k < 3; k++) if (s[0xAEFF + k] != 0xFF && s[0xAEFF + k] < 7) {
    if (${D}) { int ckK = ckBtKindAt(s, k); if (ckK < 7 && s[0xB1BE + ckK] == 0xFF) s[0xB1BE + ckK] = (uint8_t)k; }   /* [dupchars B12] */
    else s[0xB1BE + s[0xAEFF + k]] = (uint8_t)k;
  }
`, 1],
  // B18 the AI tech co-targets, compared with CC:249F group characters: kinds (a PC seat only)
  ['s[0xAEFF + s[0xAE97]]', `(${D} ? ckBtKindAt(s, s[0xAE97]) : s[0xAEFF + s[0xAE97]])`, 2],
  ['s[0xAEFF + s[0xAE98]]', `(${D} ? ckBtKindAt(s, s[0xAE98]) : s[0xAEFF + s[0xAE98]])`, 2],
  // B19 the ready pool: $B1BE[party byte] is the seat itself
  ['pool[n++] = (uint8_t)(s[0xB1BE + ch] + 1);', `pool[n++] = (uint8_t)((${D} ? seat : s[0xB1BE + ch]) + 1);`, 1],
  // B14 boot records: the seat's kind holds $B1BE while its records are built, singles by kind, bits by slot
  ['    int ch = s[0xAEFF + seat], base = battleTechRecBase(rom, seat);\n',
    `    int ch = s[0xAEFF + seat], base = battleTechRecBase(rom, seat);
    int ckKind = ${D} ? ckBtKindAt(s, seat) : ch, ckSaved = (ckKind >= 0 && ckKind < 7) ? s[0xB1BE + ckKind] : 0xFF;   /* [dupchars B14] */
    if (${D} && ckKind >= 0 && ckKind < 7) s[0xB1BE + ckKind] = (uint8_t)seat;
`, 1],
  ['(long)(ROM_TECH_SINGLES + ch))', `(long)(ROM_TECH_SINGLES + (${D} ? ckKind : ch)))`, 1],
  ['(long)(ROM_TECH_SINGLES + ch + 1))', `(long)(ROM_TECH_SINGLES + (${D} ? ckKind : ch) + 1))`, 1],
  ['        break;\n      } }\n  }\n  // CC/E755:',
    `        break;\n      } }\n    if (${D} && ckKind >= 0 && ckKind < 7) s[0xB1BE + ckKind] = (uint8_t)ckSaved;   /* [dupchars B14] restored */\n  }\n  // CC/E755:`, 1],
  // B2 the PC attack setup's action by kind
  ['int cid = s[0xAEFF + atk];', `int cid = (${D} ? ckBtKindAt(s, atk) : s[0xAEFF + atk]);`, 1],
  // B12r (run time): a participant's seat through ckTechSeat (the commanding seat first)
  ['  if (ch == 0xFF || ch >= 7) return -1;\n  int seat = s[0xB1BE + ch];',
    `  if (ch == 0xFF || ch >= 7) return -1;\n  int seat = (${D} ? ckBtTechSeat(s, ch) : s[0xB1BE + ch]);`, 1],
  ['s[0xAE96 + k] = (ch == 0xFF) ? 0xFF : s[0xB1BE + (ch & 0x7F)];',
    `s[0xAE96 + k] = (ch == 0xFF) ? 0xFF : (${D} ? ckBtTechSeat(s, ch & 0x7F) : s[0xB1BE + (ch & 0x7F)]);`, 1],
  ['int ps = s[0xB1BE + (ch & 0x7F)];', `int ps = (${D} ? ckBtTechSeat(s, ch & 0x7F) : s[0xB1BE + (ch & 0x7F)]);`, 1],
  ['int x = s[0xB1BE + ch];', `int x = (${D} ? ckBtTechSeat(s, ch) : s[0xB1BE + ch]);`, 1],
  ['int seat = (ch == 0xFF) ? 0xFF : s[0xB1BE + (ch & 0x7F)];',
    `int seat = (ch == 0xFF) ? 0xFF : (${D} ? ckBtTechSeat(s, ch & 0x7F) : s[0xB1BE + (ch & 0x7F)]);`, 1],
  // B6 the attacker's idle re-arm pose
  ['CtBattlePcWinPose(h->mem[0x2980 + sa] & 7, ',
    `CtBattlePcWinPose((${D} ? ckBtKindOf(h->mem, h->mem[0x2980 + sa]) : h->mem[0x2980 + sa]) & 7, `, 1],
  // B3 the weapon range and the normal/crit animation selectors
  ['int cid = s[0x2980 + atk];', `int cid = (${D} ? ckBtKindOf(s, s[0x2980 + atk]) : s[0x2980 + atk]);`, 1],
  // B7 / B8 the victory ladder trace and the fallen pose
  ['int cid = h->mem[0x2980 + seat] & 7;',
    `int cid = (${D} ? ckBtKindOf(h->mem, h->mem[0x2980 + seat]) : h->mem[0x2980 + seat]) & 7;`, 2],
  // B9 the victory/defeat ladder stepper
  ['int cid = s[0x2980 + seat] & 7, cur = h->pcLadderCur[seat];',
    `int cid = (${D} ? ckBtKindOf(s, s[0x2980 + seat]) : s[0x2980 + seat]) & 7, cur = h->pcLadderCur[seat];`, 1],
  // B10 the script pose engine's PC id (battle sprite)
  ['    int ch = s[0x2980 + cmb];\n', `    int ch = (${D} ? ckBtKindOf(s, s[0x2980 + cmb]) : s[0x2980 + cmb]);\n`, 1],
  // B4 Marle's strike offset
  ['s[0x2980 + h->actAttacker] == 1', `(${D} ? ckBtKindOf(s, s[0x2980 + h->actAttacker]) : s[0x2980 + h->actAttacker]) == 1`, 1],
  // B17 the level-up growth tables by kind (one edit covers the callers 14780 / 16717 / 16746)
  ['  if (!mem || id < 0 || id >= 8) return 0;\n',
    `  if (!mem || id < 0 || id >= 8) return 0;\n  id = ${D} ? ckBtKindOf(mem, id) : id;   /* [dupchars B17] */\n`, 1],
  // B16 the tech pass: $2830+ by the slot of seat $B2D0 (techF45F, techF4DF, techF39A); the CC tables by $B2D1 (= kind)
  ['int t = (s[0x2830 + id] + s[0x3B]);', `int t = (s[0x2830 + (${D} ? ckBtSlotOfSeat(s, s[0xB2D0], id) : id)] + s[0x3B]);`, 1],
  ['(uint8_t)(s[0x2830 + id] + s[0x3B]);', `(uint8_t)(s[0x2830 + (${D} ? ckBtSlotOfSeat(s, s[0xB2D0], id) : id)] + s[0x3B]);`, 1],
  ['tpWs(s, 0x02, 0x2830 + id);', `tpWs(s, 0x02, 0x2830 + (${D} ? ckBtSlotOfSeat(s, s[0xB2D0], id) : id));`, 1],
  // B15 the dual/triple membership masks by kind
  ['    int a = s[0xAEFF + i];\n    if (a == 0xFF) continue;\n',
    `    int a = (${D} ? ckBtKindAt(s, i) : s[0xAEFF + i]);\n    if (a == 0xFF) continue;\n`, 1],
  // B16 techF533: the combination's members are kinds; their tech level is the slot's of the lowest seat of that kind
  ['s[0x2830 + tpW(s, 0x12)]', `s[0x2830 + (${D} ? ckBtSlotOfKind(s, tpW(s, 0x12)) : tpW(s, 0x12))]`, 1],
  // B16 the results' learned-tech lines (14788) and the rewards' trace list (16757): CC/276A by kind, id = the slot
  ['(long)(0x0C276A + ((id << 1) & 0xFF))', `(long)(0x0C276A + (((${D} ? ckBtKindOf(h->mem, id) : id) << 1) & 0xFF))`, 2],
  // extra K: the PC loader pointers (sprite gfx, assembly, pose windows) the live gather reads
  ['    int c = s[0x2980 + y], a2 = (c << 1) & 0xFF,', `    int c = (${D} ? ckBtKindOf(s, s[0x2980 + y]) : s[0x2980 + y]), a2 = (c << 1) & 0xFF,`, 1],
  // B5 the forced physical's action by kind
  ['(long)(ROM_PC_ACTION_SEL + s[0xAEFF + y])', `(long)(ROM_PC_ACTION_SEL + (${D} ? ckBtKindAt(s, y) : s[0xAEFF + y]))`, 1],
  // B11 the walk's pose stage
  ['int charId = s[0x2980 + seat] & 7;', `int charId = (${D} ? ckBtKindOf(s, s[0x2980 + seat]) : s[0x2980 + seat]) & 7;`, 1],
  // B13 the reserve XP: "not in the fight" = the slot is not in the party bytes
  ['!(s[0xB1BE + id] & 0x80)', `(${D} ? ckBtSeatedSlot(s, id) : !(s[0xB1BE + id] & 0x80))`, 1],
  // B20 (I-115 follow-up) battleSkeleton: the ROM-free swing ladder (fxAtkPose / critAnim, drawn by field.c
  // battleAttackRender) is published for seat 0 only; under the gate for any seat whose kind is Crono (field.c F7 draws it
  // at that seat). The ROM-free walker (battlePcAtkArm) stays seat 0's: elsewhere the swing is planted (the fixed table).
  ['  if (h->actAttacker != 0) return;',
    `  if (${D} ? (h->actAttacker < 0 || h->actAttacker >= 3 || ckBtKindOf(h->mem, h->mem[0x2980 + h->actAttacker]) != 0) : h->actAttacker != 0) return;`, 1],
];

const MOVE_PATCHES = [
  // V4 the triple-tech availability flags by kind
  ['have &= ~MR(0x3FF9BB + pc);', `have &= ~MR(0x3FF9BB + (${D} ? ckMvKindOf(r, pc) : pc));`, 1],
  // V2 op 0x80 (and its seven fixed siblings): the PC descriptor walk by kind; $1101 and the party match stay the slot
  ['  ctPcLoad(r, rom, romLen, idx, id, yIn);', `  ctPcLoad(r, rom, romLen, idx, (${D} ? ckMvKindOf(r, id) : id), yIn);`, 1],
];

// The classified-read guard (design section 5): every `0x2980 + ` / `0xAEFF + ` read of the input was reviewed (patched
// above, or slot by design). A new or removed one changes the count and stops the build: classify it here.
const READ_COUNTS = {
  'battle.c': [['0x2980 + ', 39], ['0xAEFF + ', 66]],
  'move.c': [['0x2980 + ', 13], ['0xAEFF + ', 0]],
};

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const checkReads = (name, text) => {
  for (const [find, count] of READ_COUNTS[name]) {
    const found = occurrences(text, find);
    if (found !== count) {
      throw new Error(`${name}: ${found} reads of ${JSON.stringify(find)}, ${count} classified; upstream changed, classify them in patches/duplicate-chars-battle.mjs`);
    }
  }
};

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/duplicate-chars-battle.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const withHelpers = (name, text, helpers) => {
  if (!text.startsWith(INCLUDE)) throw new Error(`${name}: the copy does not start with ${JSON.stringify(INCLUDE)}`);
  return `${INCLUDE}${helpers}${text.slice(INCLUDE.length)}`;
};

// returns { patches, files: [absolute paths of the game module's patched copies], replaced: ['src/battle.c', 'src/move.c', ...] }:
// sightResult's files with its battle.c swapped for this one's, plus move.c
const writeDuplicateCharsBattle = (sightResult, genDir, belthasar) => {
  const sightBattle = sightResult.files.filter((f) => basename(f) === 'battle.c');
  if (sightBattle.length !== 1) throw new Error(`duplicate-chars-battle: expected one battle.c in the sightscope result, found ${sightBattle.length}`);
  const dir = join(genDir, 'dupchars');
  mkdirSync(dir, { recursive: true });
  const battle = join(dir, 'battle.c');
  const battleIn = readFileSync(sightBattle[0], 'utf8').replace(/\r\n/g, '\n');
  checkReads('battle.c', battleIn);
  writeFileSync(battle, applyPatches('battle.c', withHelpers('battle.c', battleIn, BATTLE_HELPERS), BATTLE_PATCHES));
  const move = join(dir, 'move.c');
  const moveIn = readFileSync(join(belthasar, 'src', 'move.c'), 'utf8').replace(/\r\n/g, '\n');
  checkReads('move.c', moveIn);
  writeFileSync(move, applyPatches('move.c', withHelpers('move.c', `${INCLUDE}${moveIn}`, MOVE_HELPERS), MOVE_PATCHES));
  const files = [...sightResult.files.filter((f) => f !== sightBattle[0]), battle, move];
  const replaced = [...new Set([...sightResult.replaced, 'src/battle.c', 'src/move.c'])];
  return { patches: BATTLE_PATCHES.length + MOVE_PATCHES.length, files, replaced };
};

export { BATTLE_PATCHES, MOVE_PATCHES, writeDuplicateCharsBattle };
