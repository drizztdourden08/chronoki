// The menu section's guard for field.c (docs/plans/save-state-anywhere-plan.md, phase 3). The MENU section keeps, besides the
// host locals the HOST section already copies, what the host-fields parser cannot see or main() does not own:
//  * mSave, an anonymous-struct local of main() (the C0/011B save block). The parser skips an anonymous struct, so it is not in
//    HOST; reconnect/ck_menu_msave.h lists its members and this file checks them against the struct body, and that no other
//    anonymous-struct local appears before the loop (it would be missing from both sections);
//  * the field.c statics in ck_menu_fstat.h, which must still be declared; every other field.c static named like a menu or
//    config/strings one (g_str*, g_cfg*, g_menu*, menu*) must be listed there or excluded below with its class;
//  * menuStash, the caller's WRAM put aside for the menu: its size (0x60F8, the six overworld blocks; the field's block is
//    0x14E0 at $0920) and menuFb's size (CAMW x CAMH x 3) are checked against ck_menu_state.h's constants.
// A changed type or size of a listed name is the compiler's: the table takes sizeof of each designator.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { macroList, memberNames, stripComments } from './world-fields.mjs';
import { preLoopText, strip } from './main-locals.mjs';
import { fileScopeStatics } from './world-statics.mjs';

const EXCLUDED = {
  asset: 'menuFont menuFontC2Buf menuFontC2',
  debug: 'g_menuSfxPosts g_menuSfxMoves',
};
const NAMED_LIKE_MENU = /^(g_str[A-Z]|g_cfg[A-Z]|g_menu|menu[A-Z])/;

const anonymousLocals = (field) =>
  [...strip(preLoopText(field).text).matchAll(/^ {2}\}\s*([A-Za-z_]\w*)\s*(?:\[[^\]]*\]\s*)*;/gm)].map((m) => m[1]);

const mSaveBody = (field) => {
  const end = field.indexOf('} mSave;');
  const start = end < 0 ? -1 : field.lastIndexOf('struct {', end);
  if (start < 0) throw new Error('field.c: the anonymous struct local mSave moved; update menu-fields.mjs');
  return stripComments(field.slice(field.indexOf('{', start) + 1, end));
};

const checkMenuFields = (fieldText, root) => {
  const out = [];
  const members = memberNames(mSaveBody(fieldText));
  const listed = macroList(root, 'ck_menu_msave.h', 'CK_MSAVE').map(([m]) => m);
  for (const m of members) if (!listed.includes(m)) out.push(`mSave.${m} is new: add it to ck_menu_msave.h`);
  for (const m of listed) if (!members.includes(m)) out.push(`ck_menu_msave.h lists mSave.${m}, no longer a member`);
  for (const n of anonymousLocals(fieldText)) if (n !== 'mSave') out.push(`main() has an anonymous-struct local ${n}: neither HOST nor MENU can see it; list its members in the menu section`);

  const statics = new Set(fileScopeStatics(fieldText));
  const kept = macroList(root, 'ck_menu_fstat.h', 'CK_MFSTAT').map(([n]) => n);
  const excluded = new Set(Object.values(EXCLUDED).flatMap((n) => n.split(' ')));
  for (const n of kept) if (!statics.has(n)) out.push(`field.c static ${n} (ck_menu_fstat.h) is no longer declared at file scope`);
  for (const n of excluded) if (!statics.has(n)) out.push(`excluded field.c static ${n} is no longer declared`);
  for (const n of statics) if (NAMED_LIKE_MENU.test(n) && !kept.includes(n) && !excluded.has(n)) out.push(`field.c static ${n} looks like menu state: add it to ck_menu_fstat.h or classify it in menu-fields.mjs`);
  for (const n of kept) if (excluded.has(n)) out.push(`${n} is both kept and excluded`);

  const text = stripComments(fieldText);
  const stateH = readFileSync(join(root, 'core', 'reconnect', 'ck_menu_state.h'), 'utf8');
  const stashBytes = /#define CK_M_STASH_BYTES (0x[0-9A-Fa-f]+)/.exec(stateH)?.[1];
  const owBlocks = /kOwStash\[6\]\s*=\s*\{([^;]*)\};/.exec(text)?.[1];
  const owTotal = owBlocks ? [...owBlocks.matchAll(/\{\s*0x[0-9A-Fa-f]+\s*,\s*(0x[0-9A-Fa-f]+)\s*\}/g)].reduce((s, m) => s + Number(m[1]), 0) : -1;
  if (owTotal !== Number(stashBytes)) out.push(`the overworld stash blocks (kOwStash) total ${owTotal}, ck_menu_state.h says CK_M_STASH_BYTES ${stashBytes}`);
  if (!text.includes(`menuStash = (uint8_t*)malloc(${stashBytes})`)) out.push(`menuStash is no longer malloc(${stashBytes})`);
  if (!text.includes('memcpy(menuStash, s7 + 0x0920, 0x14E0)')) out.push('the field stash is no longer $0920, 0x14E0 bytes (ck_menu_load.inc puts it back)');
  if (!/#define CAMW 256\b/.test(text) || !/#define CAMH 224\b/.test(text)) out.push('CAMW x CAMH is no longer 256 x 224 (CK_M_FB_PIXELS in ck_menu_state.h)');
  if (!text.includes('menuFb = (uint8_t*)malloc((size_t)CAMW * CAMH * 3)')) out.push('menuFb is no longer CAMW x CAMH x 3 bytes');
  if (out.length) throw new Error(`menu section fields out of step with field.c:\n  ${out.join('\n  ')}`);
};

// the lists as one text, for the schema hash (state-stamp.mjs)
const menuFieldListText = (root) =>
  [['ck_menu_msave.h', 'CK_MSAVE'], ['ck_menu_fstat.h', 'CK_MFSTAT'], ['ck_menu_statics.h', 'CK_MSTAT']]
    .map(([f, m]) => macroList(root, f, m).map((a) => a.join('.')).join(',')).join('|');

export { checkMenuFields, menuFieldListText }
