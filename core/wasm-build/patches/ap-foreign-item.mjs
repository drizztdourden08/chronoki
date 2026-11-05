// Build-time text patches for multiworld's foreign item (I-117 C4): a chest or a gift holding another player's item.
// The same contract as RotP's core/game-hooks/foreign_item.c on CT's engine: the location behaves as for any item (the
// chest's opened bit, the box and its text; the gift's op exits), nothing enters the inventory, and the location is
// reported to the host (reconnect/ap_reconnect.c, CK_AP_EV_CHEST / CK_AP_EV_GIFT) so it sends the check.
//  * Gate: ck_ap_online() (CkSetApOnline, a multiworld session is active). Off, every call site runs the original code:
//    the two ct_vm.c sites call ckApItemFamily, which is CtVmItemFamily itself while the gate is off.
//  * Sentinel: CK_AP_FOREIGN_ITEM (0xFE, ck_ap.h). CT item ids run 0x01..0xF1.
//  * field.c fieldTreasureProbe (C0/1DF4, the award C0/1E0C-1E8F): every chest whose opened bit is set is reported
//    (loc, record r = chest-LLL-n, flag idx, payload); the foreign item skips fieldAddItem (C1/8003 leaf 1).
//  * field.c fieldTreasureMessage, {item} (code 0x1F): the foreign item shows the host's line ("<item> for <player>").
//  * ct_vm.c, both CtVmItemFamily call sites (runFunc's init pass and the step's $C1 family): op 0xCA reports a gift
//    (loc $7E:0100, object, the operand's offset in the script entry = patchAt of gift-LLL-oN); the foreign item runs the
//    op's exits without the AddItem leaf (ap_reconnect.c ckApItemFamily).
//  * ct_vm.c {item} (code 0x1F, C2/5B9B): local 0 = the foreign item shows the host's line, in CT charset.
// Each anchor must match exactly once; any mismatch stops the build. Applied in place on the patched copies under out/gen/
// (after duplicate-chars.mjs, which puts ck_reconnect.h first in ct_vm.c and field.c). core/belthasar is never edited.
import { readFileSync, writeFileSync } from 'node:fs';

const FIELD_PATCHES = [
  ['      fieldTreasureSetOpened(glb, idx);',
    '      if (ck_ap_online()) ck_ap_chest_opened(loc, r, idx, pay);   /* [chronoki] multiworld: report the chest */\n'
      + '      fieldTreasureSetOpened(glb, idx);', 1],
  ['        fieldAddItem(s7, itemId);',
    '        if (!(ck_ap_online() && itemId == CK_AP_FOREIGN_ITEM))   /* [chronoki] multiworld: the foreign item adds nothing */\n'
      + '        fieldAddItem(s7, itemId);', 1],
  ['      char nb[24] = "";\n',
    '      if (ck_ap_online() && itemId == CK_AP_FOREIGN_ITEM) { o = fieldCtAppend(out, o, cap, ck_ap_foreign_line()); continue; }   /* [chronoki] multiworld */\n'
      + '      char nb[24] = "";\n', 1],
];

const VM_PATCHES = [
  ['CtVmItemFamily(mem->s, B - hdr, addr + hdr, &ni);',
    'ckApItemFamily(mem->s, B - hdr, addr + hdr, &ni, obj, addr + hdr + 1);', 1],
  ['    CtVmItemFamily(sc->mem->s, B, addr, &ni);',
    '    ckApItemFamily(sc->mem->s, B, addr, &ni, obj, addr + sc->header + 1);   /* [chronoki] multiworld: gifts */', 1],
  ['        uint32_t at = 0x0C0B5Fu + (uint32_t)sc->mem->l[0] * 11u;',
    '        if (ck_ap_online() && sc->mem->l[0] == CK_AP_FOREIGN_ITEM) { o = ck_ap_foreign_line_ct(out, o, cap); continue; }   /* [chronoki] multiworld */\n'
      + '        uint32_t at = 0x0C0B5Fu + (uint32_t)sc->mem->l[0] * 11u;', 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/ap-foreign-item.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const INCLUDE = '#include "ck_reconnect.h"\n';
const withInclude = (text) => (text.includes(INCLUDE) ? text : INCLUDE + text);

const SETS = { 'field.c': FIELD_PATCHES, 'ct_vm.c': VM_PATCHES };

// `state` is writeStatePatches' result after duplicate-chars.mjs: field.c and ct_vm.c are patched in place.
const writeApForeignItem = (state) => {
  const files = [];
  for (const [name, patches] of Object.entries(SETS)) {
    const file = state.files.find((f) => new RegExp(`[\\\\/]${name.replace('.', '\\.')}$`).test(f));
    if (!file) throw new Error(`ap-foreign-item: no patched ${name} from state-patches.mjs`);
    const text = withInclude(readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
    writeFileSync(file, applyPatches(name, text, patches));
    files.push(file);
  }
  return { patches: FIELD_PATCHES.length + VM_PATCHES.length, files };
};

export { FIELD_PATCHES as AP_FOREIGN_FIELD_PATCHES, VM_PATCHES as AP_FOREIGN_VM_PATCHES, writeApForeignItem };
