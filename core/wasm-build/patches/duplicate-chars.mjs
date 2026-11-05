// Build-time text patches for duplicate characters (I-115, [chronoki] duplicate_characters, ck_dup_chars()): the field,
// overworld, menu and script-VM side. battle.c and move.c are duplicate-chars-battle.mjs's.
// A party byte ($7E:2980 + i) is a SLOT (story identity); sheet byte +0x00 ($7E:2600 + slot * 0x50) is its KIND (looks,
// attack, techs, equipment). Every site that uses a slot as a kind becomes `ck_dup_chars() ? <kind> : <original>`
// (helpers in core/reconnect/ck_dup_chars.inc), so the option off is the original code. Exact matches with an expected
// count; any mismatch stops the build. Applied in place on the copies writeStatePatches wrote under out/gen/state/, after
// every other patch on them (visible-techs.mjs last), then the read guard (duplicate-chars-reads.mjs) checks them.
// core/belthasar is never edited.
import { readFileSync, writeFileSync } from 'node:fs';
import { checkDuplicateCharReads } from './duplicate-chars-reads.mjs';

const K = (wram, slot) => `ck_dup_chars() ? ckPcKind(${wram}, ${slot}) : `;

// [what to find, what to put, how many times it must occur]
const CT_VM_PATCHES = [
  // V1 pcLoadMirror: a party member's sprite header (C0/449B, CC/F000 + id * 5) by kind.
  ['loadGfxMirror(m, obj, CtRomPtr(gRomImg, gRomImgLen, 0x24F000 + (long)id * 5, 5), 1);',
    'loadGfxMirror(m, obj, CtRomPtr(gRomImg, gRomImgLen, 0x24F000 + (long)(ck_dup_chars() ? ckPcKind(m->s, id) : id) * 5, 5), 1);', 1],
];

// Names, field side: the naming screen's prefill ($2C23 record) is the kind's default name for a slot shown as another
// kind (the coordinator's addition; CtMenuNewGameWipe below sets the engine's g_ctName the same way). The player's name
// still replaces it. Inserted after battleHudCtEncode (ASCII -> CT charset), before the strip's code.
const NAME_PREFILL = `/* [chronoki] duplicate characters: the naming screen's prefill for a slot shown as another kind (ckKindDefaultName). */
static const uint8_t* ckDupNamePrefill(const uint8_t* s7, int id) {
  static uint8_t rec[6];
  const char* nm = ckKindDefaultName(s7, id);
  if (!nm) return s7 + 0x2C23 + id * 6;
  int i = 0;
  for (; i < 5 && nm[i]; i++) rec[i] = (uint8_t)battleHudCtEncode(nm[i]);
  for (; i < 6; i++) rec[i] = 0;
  return rec;
}
/* [chronoki] duplicate characters: the trimmed name \`st\` is the kind's default name of a slot shown as another kind, so the
   naming screen's duplicate check (C2/E3E0) lets it stand (a second Crono keeps "Crono"); any other clash is still refused. */
static int ckDupNameIsKindDefault(const uint8_t* s7, int id, const uint8_t* st) {
  if (!ckKindDefaultName(s7, id)) return 0;
  const uint8_t* d = ckDupNamePrefill(s7, id);
  for (int i = 0; i < 5; i++) { if (st[i] != d[i]) return 0; if (st[i] == 0x00) return 1; }
  return 1;
}
`;
const STRIP_MARK = "// ---- Strip's visible band (disasm/notes/battle_hud_band_anim.md) ----\n";

const FIELD_PATCHES = [
  // F5 / F6: the overworld party's graphics and palettes (C2/2BBC), by kind.
  ['    unsigned id = w->wram[0x2980 + i];\n',
    `    unsigned id = ck_dup_chars() ? (unsigned)ckPcKind(w->wram, w->wram[0x2980 + i]) : w->wram[0x2980 + i];\n`, 1],
  ['(uint16_t)(0x8E00 + (w->wram[0x2980 + i] & 0xFF) * 32)',
    '(uint16_t)(0x8E00 + (ck_dup_chars() ? ckPcKind(w->wram, w->wram[0x2980 + i] & 0xFF) : (w->wram[0x2980 + i] & 0xFF)) * 32)', 1],
  // F1 / F3 / F4: Marle's attack pose, melee ladder and spark key on the attacker's kind.
  ['if (atk < 0 || atk >= 3 || mem[0x2980 + atk] != 1) return -1;',
    `if (atk < 0 || atk >= 3 || (${K('mem', 'mem[0x2980 + atk]')}mem[0x2980 + atk]) != 1) return -1;`, 1],
  ['&& mem[0x2980 + h->actAttacker] == 1) {',
    `&& (${K('mem', 'mem[0x2980 + h->actAttacker]')}mem[0x2980 + h->actAttacker]) == 1) {`, 1],
  ['if (!h->actActive || atk < 0 || atk >= 3 || mem[0x2980 + atk] != 1) return;',
    `if (!h->actActive || atk < 0 || atk >= 3 || (${K('mem', 'mem[0x2980 + atk]')}mem[0x2980 + atk]) != 1) return;`, 1],
  // F2: each seat's battle stance is dispatched on its kind.
  ['    int charId = mem[0x2980 + seat] & 7;\n',
    `    int charId = ${K('mem', 'mem[0x2980 + seat] & 7')}mem[0x2980 + seat] & 7;\n`, 1],
  // M7 (reclassified from menu.c: ctTechCastPoseByte has no WRAM): the Tech caster's pose byte by kind.
  ['s7[0x19E1] = ctTechCastPoseByte(menuStatChar);',
    `s7[0x19E1] = ctTechCastPoseByte(${K('s7', 'menuStatChar & 7')}menuStatChar);`, 1],
  // Not in the design: the host menu's portrait is keyed by charId.
  ['? nsPortrait[portChar] : NULL;',
    `? nsPortrait[${K('s7', 'portChar')}portChar] : NULL;`, 1],
  // Names: the naming screen's prefill.
  [STRIP_MARK, `${NAME_PREFILL}\n${STRIP_MARK}`, 1],
  ['memcpy(nmCt, s7 + 0x2C23 + menuNameId * 6, 6);',
    'memcpy(nmCt, ck_dup_chars() ? ckDupNamePrefill(s7, menuNameId) : s7 + 0x2C23 + menuNameId * 6, 6);', 1],
  // Names: the commit's duplicate check (C2/E3E0) refuses a name another record holds; a slot shown as another kind may
  // keep its kind's default name (ckDupNameIsKindDefault). Gate off: the check as it is.
  ['if (dup) nameSfx(s7, 0x01, "reject-duplicate");',
    'if (ck_dup_chars() && dup && ckDupNameIsKindDefault(s7, menuNameId, st)) dup = 0;   /* [chronoki] duplicate characters */\n'
      + '                if (dup) nameSfx(s7, 0x01, "reject-duplicate");', 1],
  // F7 (I-115 follow-up): the battle PC attack render's Crono swing (battleAttackRender) and Marle crossbow
  // (battleMarleAttackRender) are drawn for combatants 0 and 1; under the gate, for the attacking seat (whose kind
  // battle.c's battleSkeleton and F1/F3/F4 already checked), and the stance layer skips only that seat.
  ['if (ladderPose < 0 && charId == 0 && cronoAtk) continue;',
    'if (ladderPose < 0 && charId == 0 && cronoAtk && (!ck_dup_chars() || seat == h->actAttacker)) continue;', 1],
  ['if (ladderPose < 0 && charId == 1 && marleAtk) continue;',
    'if (ladderPose < 0 && charId == 1 && marleAtk && (!ck_dup_chars() || seat == h->actAttacker)) continue;', 1],
  ['  if (BATTLE_ZSKIP(0)) return;',
    '  int ckAs = (ck_dup_chars() && h->actAttacker >= 0 && h->actAttacker < 3) ? h->actAttacker : 0;   /* [chronoki] duplicate characters: the swinging seat */\n'
      + '  if (BATTLE_ZSKIP(ckAs)) return;', 1],
  ['    footX = BT_LIVEX(h, 0);\n    footY = BT_LIVEY(h, 0);\n',
    '    footX = BT_LIVEX(h, ckAs);\n    footY = BT_LIVEY(h, ckAs);\n', 1],
  ['battlePcAnchorDelta(mem, 0, CT_EXT_CRONO_X', 'battlePcAnchorDelta(mem, ckAs, CT_EXT_CRONO_X', 1],
  ['CtBattlePcFacing(mem, h, 0)', 'CtBattlePcFacing(mem, h, ckAs)', 2],
  ['  if (BATTLE_ZSKIP(1)) return;',
    '  int ckMs = (ck_dup_chars() && h->actAttacker >= 0 && h->actAttacker < 3) ? h->actAttacker : 1;   /* [chronoki] duplicate characters: the firing seat */\n'
      + '  if (BATTLE_ZSKIP(ckMs)) return;', 1],
  ['battlePcAnchorDelta(mem, 1, CT_EXT_MARLE_X', 'battlePcAnchorDelta(mem, ckMs, CT_EXT_MARLE_X', 1],
];

const WORLD_PATCHES = [
  // W1 / W2 / W5: the leader's overworld sprite offset (Magus +0x0C) by kind.
  ['int magus = (ram[0x2980] == 6) ? 0x0C : 0;',
    `int magus = ((${K('ram', 'ram[0x2980]')}ram[0x2980]) == 6) ? 0x0C : 0;`, 3],
  // W3 / W4: the same for a member.
  ['int mg = (ram[0x2980 + B[0x24]] == 6) ? 0x0C : 0;',
    `int mg = ((${K('ram', 'ram[0x2980 + B[0x24]]')}ram[0x2980 + B[0x24]]) == 6) ? 0x0C : 0;`, 2],
];

const MENU_PATCHES = [
  // M4 "Can be used by" (C2/AEB6): the item's mask by kind, turned into slots (names stay per slot).
  ['  int mask = ctEqMask[itemId] & h->mem[0x29AF], n = 0;',
    '  int mask = ck_dup_chars() ? (ckKindMaskToSlots(h->mem, ctEqMask[itemId]) & h->mem[0x29AF]) : (ctEqMask[itemId] & h->mem[0x29AF]), n = 0;', 1],
  // M5 equipment candidates (FF/F9BB): the kind's bit.
  ['  int bit = 0x80 >> (charId & 7);',
    `  int bit = 0x80 >> (${K('mem', 'charId & 7')}(charId & 7));`, 1],
  // M3 the party sprite blobs, their animations and frames, by kind (the animator blocks g_mspr stay per slot).
  ['? h->partySpr[charId] : NULL;',
    `? h->partySpr[${K('h->mem', 'charId')}charId] : NULL;`, 2],
  ['  const uint8_t* an = h->spriteAnim[c];\n  unsigned al = h->spriteAnimLen[c];\n',
    `  const uint8_t* an = h->spriteAnim[${K('h->mem', 'c')}c];\n  unsigned al = h->spriteAnimLen[${K('h->mem', 'c')}c];\n`, 1],
  ['h->partySprFrame(charId, pose, &fx, &fy)',
    `h->partySprFrame(${K('h->mem', 'charId')}charId, pose, &fx, &fy)`, 1],
  ['h->partySprFrame(charId, stand, &sx, &sy)',
    `h->partySprFrame(${K('h->mem', 'charId')}charId, stand, &sx, &sy)`, 1],
  // M1 the status screen's large art (FF/CE70, FF/CE78) by kind.
  ['  const long FF = 0x3F0000L;\n  int id = charId & 7;\n',
    `  const long FF = 0x3F0000L;\n  int id = ${K('h->mem', 'charId & 7')}(charId & 7);\n`, 1],
  // M2 CtMenuTechBits: a Dual / Triple is listed when its KINDS are in the roster (singles stay by slot); a slot's
  // next tech to preview is in its kind's range (cap, first id), with the slot's own learned bits.
  ['    if (ctTechGroupMask[g] & absent) continue;',
    '    if (ctTechGroupMask[g] & (ck_dup_chars() ? (g >= 7 ? ckKindAbsent(mem) : absent) : absent)) continue;', 1],
  ['    if (n < ctTechNextCap[cch] && n < 8) {',
    `    if (n < ctTechNextCap[${K('mem', 'cch')}cch] && n < 8) {`, 1],
  ['nextIdx7[cch] = (uint8_t)(ctTechBound[cch] + n);',
    `nextIdx7[cch] = (uint8_t)(ctTechBound[${K('mem', 'cch')}cch] + n);`, 1],
  // M2 CtMenuTechList: the kind's groups, the single row's bits from the slot, costs by kind.
  ['  int mask = 0x80 >> (charId & 7), n = 0;\n  for (int g = first;',
    `  int mask = 0x80 >> (${K('h->mem', 'charId & 7')}(charId & 7)), n = 0;\n  for (int g = first;`, 1],
  ['    int b = bits[g];\n',
    '    int b = bits[ck_dup_chars() ? (g < 7 ? (charId & 7) : g) : g];\n', 1],
  ['if (mp)    mp[n] = CtMenuTechMp(charId, id, tab, acc);',
    `if (mp)    mp[n] = CtMenuTechMp(${K('h->mem', 'charId & 7')}charId, id, tab, acc);`, 1],
  // M2 with Visible Techs (its patched lines): a single's learned bit is the slot's.
  ['ckTechUnlearned(h->mem, id)',
    '(ck_dup_chars() ? ckTechUnlearnedSlot(h->mem, charId & 7, id) : ckTechUnlearned(h->mem, id))', 1],
  ['!ckTechUnlearned(mem, techId)',
    '!(ck_dup_chars() ? ckTechUnlearnedSlot(mem, charId & 7, techId) : ckTechUnlearned(mem, techId))', 1],
  // M2 CtMenuRenderTech: a Dual / Triple's partners are kinds, shown through a roster slot of that kind; MP by kind.
  ['      if ((gm & (0x80 >> k)) && k != (charId & 7)) part[np++] = k;',
    `      if ((gm & (0x80 >> k)) && k != (${K('h->mem', 'charId & 7')}(charId & 7))) part[np++] = ck_dup_chars() ? ckRosterSlotOfKind(h->mem, k, charId & 7) : k;`, 1],
  ['? CtMenuTechMp(part[i], tids[row], tab,',
    `? CtMenuTechMp(${K('h->mem', 'part[i]')}part[i], tids[row], tab,`, 1],
  ['? CtMenuTechMp(charId & 7, tids[row], tab,',
    `? CtMenuTechMp(${K('h->mem', 'charId & 7')}(charId & 7), tids[row], tab,`, 1],
  // M6 the shop's "can equip" (C2/93A8): the kind's bit. (The same text at C2/AEB6's loop is a slot mask: not touched.)
  ['// 2DDEE STA $1811,Y\n    if (mask & (0x80 >> c)) {',
    `// 2DDEE STA $1811,Y\n    if (mask & (0x80 >> (${K('mem', 'c')}c))) {`, 1],
  // M8 the load / save screens' icons from the saved sheet's kind.
  ['mBlit16(fb, ctLoaderIcon[id & 7], 120, py);',
    'mBlit16(fb, ctLoaderIcon[ck_dup_chars() ? ckSheetKind(sheet, id & 7) : (id & 7)], 120, py);', 1],
  ['mBlit16(fb, ctLoaderIcon[id & 7], 120, y);',
    'mBlit16(fb, ctLoaderIcon[ck_dup_chars() ? ckSheetKind(sheet, id & 7) : (id & 7)], 120, y);', 1],
  // Names (the coordinator's addition): at the new-game wipe, once the sheets hold their kinds, a slot shown as another
  // kind takes that kind's default name (CtSetName into ct_vm.c's g_ctName, which CtGetName reads). Gate off: no call.
  ['  if (charBase && charBaseLen >= 0x280) memcpy(wram + 0x2600, charBase, 0x280);   // 9583-958C\n',
    '  if (charBase && charBaseLen >= 0x280) memcpy(wram + 0x2600, charBase, 0x280);   // 9583-958C\n'
      + '  if (ck_dup_chars()) ckDupDefaultNames(wram);   /* [chronoki] duplicate characters: default names by kind */\n', 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/duplicate-chars.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const INCLUDE = '#include "ck_reconnect.h"\n';
const withInclude = (text) => (text.startsWith(INCLUDE) || text.includes(`\n${INCLUDE}#define fopen`) ? text : INCLUDE + text);

const SETS = { 'ct_vm.c': CT_VM_PATCHES, 'field.c': FIELD_PATCHES, 'world.c': WORLD_PATCHES, 'menu.c': MENU_PATCHES };

// `state` is writeStatePatches' result (after every other in-place patch): ct_vm.c, field.c, world.c and menu.c are
// patched in place. ct_vm.c's copy keeps upstream's CRLF, so it is matched as LF.
const writeDuplicateChars = (state, belthasar) => {
  const patched = {};
  const files = [];
  for (const [name, patches] of Object.entries(SETS)) {
    const file = state.files.find((f) => new RegExp(`[\\\\/]${name.replace('.', '\\.')}$`).test(f));
    if (!file) throw new Error(`duplicate-chars: no patched ${name} from state-patches.mjs`);
    const text = withInclude(readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
    patched[name] = applyPatches(name, text, patches);
    writeFileSync(file, patched[name]);
    files.push(file);
  }
  const reads = checkDuplicateCharReads(belthasar, patched);
  return { patches: Object.values(SETS).reduce((n, p) => n + p.length, 0), reads, files };
};

export { CT_VM_PATCHES, FIELD_PATCHES, MENU_PATCHES, WORLD_PATCHES, writeDuplicateChars };
