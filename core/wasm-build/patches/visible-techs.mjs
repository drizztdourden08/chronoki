// Build-time text patch for the menu (src/menu.c): [chronoki] visible_techs (ck_visible_techs()). Exact matches with an
// expected count; any mismatch stops the build (the camera-lock.mjs precedent). Applied right after writeStatePatches, on
// the menu.c copy it wrote under out/gen/state/. core/belthasar is never edited.
//  * With the option off every inserted branch must be the original code. B5 fills VISIBLE_TECHS_PATCHES; empty = identical.
import { readFileSync, writeFileSync } from 'node:fs';

// [what to find, what to put, how many times it must occur]
const FIELD_USABLE = [
  'int CtMenuTechFieldUsable(const uint8_t* mem, int charId, int techId) {',
  '  static const int kNine[9] = { 0x09, 0x0C, 0x0F, 0x1A, 0x1D, 0x21, 0x24, 0x27, 0x29 };',
  '  int ok = 0;',
  '  for (int i = 0; i < 9; i++) if (kNine[i] == techId) { ok = 1; break; }',
  '  if (!ok) return 0;',
  '  uint8_t bits[37], nxt[7];',
  "  CtMenuTechBits(mem, bits, nxt);                             // FF/F876's preview marker clears bit7",
  '  return nxt[charId & 7] != (uint8_t)techId;',
  '',
].join('\n');

const TECH_BITS_END = "  for (int k = 0; k < 5; k++) bits37[32 + k] = mem[0x2857 + k];        // C2/B979's MVN (the rock triples)\n";

const VISIBLE_TECHS_PATCHES = [
  // 1. CtMenuTechBits: every roster character's eight singles are listed (the FF/F876 magic gate counts as FF).
  [TECH_BITS_END,
    `${TECH_BITS_END}  if (ck_visible_techs())   /* [chronoki] all 8 singles of each roster character */\n    for (int k = 0; k < 7; k++) if (!(ctTechGroupMask[k] & absent)) bits37[k] = 0xFF;\n`, 1],
  // 2. CtMenuTechList: a single is dim when not learned (vanilla: only the one previewed).
  ['dim[n] = (nxt[charId & 7] == id) ? 1 : 0;',
    'dim[n] = (ck_visible_techs() && g < 7) ? ckTechUnlearned(h->mem, id) : (nxt[charId & 7] == id) ? 1 : 0;', 1],
  // 3. CtMenuTechFieldUsable (first use in the file, so it also brings in the header and the helpers): dim is never castable.
  [FIELD_USABLE,
    `#include "ck_reconnect.h"\n#include "ck_visible_techs.inc"\n${FIELD_USABLE.replace('  return nxt[charId & 7] != (uint8_t)techId;', '  return ck_visible_techs() ? !ckTechUnlearned(mem, techId) : nxt[charId & 7] != (uint8_t)techId;')}`, 1],
  // 4. The Tech screen's "Need": total TP still needed for the highlighted dim tech.
  ['mNumR(h, fb, sh[0x2D] | (sh[0x2E] << 8), 120, 88);',
    'mNumR(h, fb, ck_visible_techs() ? ckTechNeed(h, charId, tids[row], sh) : (sh[0x2D] | (sh[0x2E] << 8)), 120, 88);', 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/visible-techs.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

// `state` is writeStatePatches' result: menu.c's copy is patched in place.
const writeVisibleTechs = (state) => {
  const menu = state.files.find((f) => /[\\/]menu\.c$/.test(f));
  if (!menu) throw new Error('visible-techs: no patched menu.c from state-patches.mjs');
  writeFileSync(menu, applyPatches('menu.c', readFileSync(menu, 'utf8'), VISIBLE_TECHS_PATCHES));
  return { patches: VISIBLE_TECHS_PATCHES.length, files: [menu] };
};

export { VISIBLE_TECHS_PATCHES, writeVisibleTechs };
