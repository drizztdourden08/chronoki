// The battle section's guard (docs/plans/save-state-anywhere-plan.md, phase 4; classes: docs/plans/save-state-host-fields.md,
// "Battle section"). battle.h's CtBattleHost holds the fight's state; reconnect/ck_battle_fields.h lists the members the BATL
// section keeps. Every CtBattleHost member must be listed or named below with its class, so a member upstream adds, renames
// or removes fails the build with its name instead of being silently left out of (or stale in) a state. The field.c statics
// in ck_battle_fstat.h must still be file-scope statics of the patched field.c, and every field.c static named like the
// battle's host (g_battle*, g_b*, g_bw*, g_bhud*) must be listed there or classified below.
// A changed type or size is the compiler's: the table takes sizeof of each member.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { macroList, memberNames, stripComments } from './world-fields.mjs';
import { fileScopeStatics } from './world-statics.mjs';

// the CtBattleHost members not in the section, by class
const EXCLUDED = {
  pointer: 'mem glb frame ctx',
};
// the field.c statics named like the battle's host that the section does not keep, by class
const FIELD_EXCLUDED = {
  render: `g_bBoxRow g_bDrawOnly g_bMotCanvas g_bObjPalCur g_bObjPalMask g_bObjPrioMask g_bWorld g_bwBand g_bwFb g_bwPre g_bwW
    g_bwX g_bwXc g_bhudStripDy`,
  debug: 'g_bhudShotBand',
};
const NAMED_LIKE_BATTLE = /^(g_battle|g_b[A-Z]|g_bw[A-Z]|g_bhud)/;

const classes = (table) =>
  new Map(Object.entries(table).flatMap(([c, n]) => n.split(/\s+/).filter(Boolean).map((x) => [x, c])));

const hostBody = (belthasar) => {
  const text = readFileSync(join(belthasar, 'src', 'battle.h'), 'utf8').replace(/\r\n/g, '\n');
  const end = text.indexOf('} CtBattleHost;');
  if (end < 0) throw new Error('battle.h: "} CtBattleHost;" not found; the struct moved upstream, update battle-fields.mjs');
  const start = text.lastIndexOf('typedef struct', end);
  return stripComments(text.slice(text.indexOf('{', start) + 1, end));
};

// patchedField: field.c after state-patches.mjs's patches (prevPort and g_ckBattleMap are file scope there)
const checkBattleFields = (patchedField, belthasar, root) => {
  const out = [];
  const excluded = classes(EXCLUDED);
  const members = memberNames(hostBody(belthasar));
  const listed = macroList(root, 'ck_battle_fields.h', 'CK_BATTLE').map(([m]) => m);
  for (const m of members) if (!listed.includes(m) && !excluded.has(m)) out.push(`CtBattleHost.${m} is new: add it to ck_battle_fields.h or classify it`);
  for (const m of listed) if (!members.includes(m)) out.push(`ck_battle_fields.h lists CtBattleHost.${m}, no longer a member`);
  for (const [m, c] of excluded) if (!members.includes(m)) out.push(`excluded CtBattleHost.${m} (${c}) is no longer a member`);
  for (const m of listed) if (excluded.has(m)) out.push(`CtBattleHost.${m} is both listed and excluded`);
  for (const m of new Set(listed)) if (listed.indexOf(m) !== listed.lastIndexOf(m)) out.push(`ck_battle_fields.h lists ${m} twice`);

  const statics = new Set(fileScopeStatics(patchedField));
  const kept = macroList(root, 'ck_battle_fstat.h', 'CK_BFSTAT').map(([n]) => n);
  const fieldExcluded = classes(FIELD_EXCLUDED);
  for (const n of kept) if (!statics.has(n)) out.push(`field.c static ${n} (ck_battle_fstat.h) is no longer declared at file scope`);
  for (const [n, c] of fieldExcluded) if (!statics.has(n)) out.push(`excluded field.c static ${n} (${c}) is no longer declared`);
  for (const n of statics) if (NAMED_LIKE_BATTLE.test(n) && !kept.includes(n) && !fieldExcluded.has(n)) out.push(`field.c static ${n} looks like battle state: add it to ck_battle_fstat.h or classify it in battle-fields.mjs`);
  for (const n of kept) if (fieldExcluded.has(n)) out.push(`${n} is both kept and excluded`);
  if (out.length) throw new Error(`battle section fields out of step with the engine:\n  ${out.join('\n  ')}`);
};

// the lists as one text, for the schema hash (state-stamp.mjs)
const battleFieldListText = (root) =>
  [['ck_battle_fields.h', 'CK_BATTLE'], ['ck_battle_fstat.h', 'CK_BFSTAT'], ['ck_battle_statics.h', 'CK_BSTAT'], ['ck_battle_statics.h', 'CK_BGLOB']]
    .map(([f, m]) => macroList(root, f, m).map((a) => a.join('.')).join(',')).join('|');

export { checkBattleFields, battleFieldListText }
