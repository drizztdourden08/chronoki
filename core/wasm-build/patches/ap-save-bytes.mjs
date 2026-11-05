// Build-time text patches for multiworld's save bytes (I-117 C4): the received-item index (u16) and the room hash (u32)
// travel with each save slot, as RotP keeps them in its save (core/game-hooks/ap_received_index.c, ap_room_hash.c).
// Where: CT's eight save records (menu.c CT_SAVE_RECS, FF/FA7B) pack 0x0834 bytes into each 0x0A00 slot (bases 0x0000,
// 0x0A00, 0x1400). Slot +0x0834..+0x09FF is written by no one, never loaded (FF/FAA3 copies the same eight records back),
// read by no summary, and only covered by the slot checksum (FF/FBE7, over the whole 0x0A00). ap_reconnect.c keeps 12 bytes
// at +0x0834: "CKAP", the slot's own "Save #" ($7E:299C, record 0 +0x59C), the index, the hash. A later offline save of the
// slot bumps "Save #" and leaves the tail, so it reads back as no data (0, 0).
//  * menu.c CtMenuSaveWrite (FF/F9FB): the tail is written after the eight records and before the checksum, so the slot
//    stays valid (FF/F9C4).
//  * menu.c CtMenuSaveLoad (FF/FAA3): the tail is read after the eight records.
//  * menu.c CtMenuNewGameWipe (C2/9571): the index goes back to 0.
//  * Gate: ck_ap_online() (CkSetApOnline). Off, no byte is written or read: vanilla and single-player saves are identical.
// Save states carry the same two values in the stamp (reconnect/ck_state.c, the "ap=" line). Each anchor must match exactly
// once; any mismatch stops the build. Applied in place on the patched menu.c copy (after duplicate-chars.mjs, which puts
// ck_reconnect.h first). core/belthasar is never edited.
import { readFileSync, writeFileSync } from 'node:fs';

const MENU_PATCHES = [
  ['  unsigned sum = ctSaveChecksum(sram + base);',
    '  if (ck_ap_online()) ck_ap_sram_put(sram + base);   /* [chronoki] multiworld: index + room hash into the slot\'s spare tail */\n'
      + '  unsigned sum = ctSaveChecksum(sram + base);', 1],
  ['  return (int)off;                                    // 0x0834 with the ROM\'s table intact',
    '  if (ck_ap_online()) ck_ap_sram_get(sram + base);   /* [chronoki] multiworld: index + room hash from the slot\'s tail */\n'
      + '  return (int)off;                                    // 0x0834 with the ROM\'s table intact', 1],
  ['  memset(wram + 0x2C7C, 0, 0x1E);                     // 95AA-95B6\n',
    '  memset(wram + 0x2C7C, 0, 0x1E);                     // 95AA-95B6\n'
      + '  if (ck_ap_online()) ck_ap_new_game();               /* [chronoki] multiworld: a new game has received nothing */\n', 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/ap-save-bytes.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const INCLUDE = '#include "ck_reconnect.h"\n';
const withInclude = (text) => (text.includes(INCLUDE) ? text : INCLUDE + text);

const writeApSaveBytes = (state) => {
  const menu = state.files.find((f) => /[\\/]menu\.c$/.test(f));
  if (!menu) throw new Error('ap-save-bytes: no patched menu.c from state-patches.mjs');
  writeFileSync(menu, applyPatches('menu.c', withInclude(readFileSync(menu, 'utf8').replace(/\r\n/g, '\n')), MENU_PATCHES));
  return { patches: MENU_PATCHES.length, files: [menu] };
};

export { MENU_PATCHES as AP_SAVE_MENU_PATCHES, writeApSaveBytes };
