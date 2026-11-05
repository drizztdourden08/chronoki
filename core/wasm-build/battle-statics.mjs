// The battle section's guard for battle.c's statics and globals (docs/plans/save-state-anywhere-plan.md, phase 4; classes:
// docs/plans/save-state-host-fields.md, "Battle section"). The cross-frame ones the section keeps are listed in
// reconnect/ck_battle_statics.h (ck_battle_state.inc, appended to the patched battle.c, takes their addresses): CK_BSTAT for
// file-scope statics, CK_BGLOB for globals. Every other file-scope static and every other column-0 global variable must be
// named below with its class. A name upstream adds, renames or removes fails the build with its name. Function-local
// statics are not seen here (they are not reachable from the safe point; the doc classifies the ones that matter).
import { macroList } from './world-fields.mjs';
import { fileScopeStatics } from './world-statics.mjs';

const EXCLUDED = {
  rom: 'gRom gRomLen gRomEmpty',
  config: 'gBattleSnd gBattleSndOn',
  pointer: 'g_stripHost',
  scratch: 'g_fxTeardownPreNmi gBattleLineCutRam gBattleFxRow gBattleLineCutOn gBattleLineAt',
  trace: 'g_btStatusTimedUnported',
};
const GLOBAL_EXCLUDED = {
  scratch: 'gBattleFxRowModelled gBattleFxArenaRows gBattleFxFront gBattleFxFrontMath gBattleFxCutSnap gBattleFxCutLine gBattleFxCutN',
  trace: 'gBtAiReduceNonTerm',
};

const names = (table) => new Set(Object.values(table).flatMap((n) => n.split(/\s+/).filter(Boolean)));

// column-0 variable definitions that are not static, extern or typedef: read as statics by fileScopeStatics' parser
const GLOBAL_LINE = /^(?!static\b|extern\b|typedef\b|return\b)(?:const\s+)?(?:unsigned\s+|signed\s+)?(?:int|long|short|char|float|double|size_t|u?int\d+_t|Bt\w+|Ct\w+)\b[^(]*;/;
const globalNames = (text) =>
  fileScopeStatics(text.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => GLOBAL_LINE.test(l)).map((l) => `static ${l}`).join('\n'));

const checkBattleStatics = (text, root) => {
  const out = [];
  const kept = macroList(root, 'ck_battle_statics.h', 'CK_BSTAT').map(([n]) => n);
  const keptGlobals = macroList(root, 'ck_battle_statics.h', 'CK_BGLOB').map(([n]) => n);
  const excluded = names(EXCLUDED);
  const found = new Set(fileScopeStatics(text));
  for (const n of found) if (!kept.includes(n) && !excluded.has(n)) out.push(`battle.c static ${n} is new: add it to ck_battle_statics.h or classify it`);
  for (const n of kept) if (!found.has(n)) out.push(`ck_battle_statics.h lists ${n}, no longer a file-scope static of battle.c`);
  for (const n of excluded) if (!found.has(n)) out.push(`excluded battle.c static ${n} is no longer declared`);
  for (const n of kept) if (excluded.has(n)) out.push(`${n} is both kept and excluded`);

  const globalsExcluded = names(GLOBAL_EXCLUDED);
  const globals = new Set(globalNames(text));
  for (const n of globals) if (!keptGlobals.includes(n) && !globalsExcluded.has(n)) out.push(`battle.c global ${n} is new: add it to ck_battle_statics.h (CK_BGLOB) or classify it`);
  for (const n of keptGlobals) if (!globals.has(n)) out.push(`ck_battle_statics.h lists global ${n}, no longer a global of battle.c`);
  for (const n of globalsExcluded) if (!globals.has(n)) out.push(`excluded battle.c global ${n} is no longer declared`);
  if (out.length) throw new Error(`battle section statics out of step with battle.c:\n  ${out.join('\n  ')}`);
};

export { checkBattleStatics }
