// The overworld section's guard for world.c's statics (docs/plans/save-state-anywhere-plan.md, phase 2). The mutable statics
// the section keeps are listed in reconnect/ck_world_statics.h (ck_world_state.inc, appended to the patched world.c, takes
// their addresses); every other non-const file-scope static must be named below with its class. A static upstream adds,
// renames or removes fails the build with its name. Only column-0 `static` declarations are file scope; ones inside
// function bodies are indented and are not seen here (they are not reachable from the safe point either).
import { macroList } from './world-fields.mjs';

const EXCLUDED = {
  rom: 'g_owRom g_owRomLen',
  hook: 'g_owJsl g_owWinCall g_obStream',
  trace: 'g_obTrace g_owTraceFrame',
};

// names declared by one `static` statement: not a function, not const itself (a pointer to const is still mutable)
const statementNames = (stmt) => {
  const s = stmt.replace(/struct\s*\{[^}]*\}/g, 'struct_t').trim();
  if (!/^static\s/.test(s) || /^static\s+inline\b/.test(s)) return [];
  const eq = s.indexOf('=');
  const paren = s.indexOf('(');
  if (paren >= 0 && (eq < 0 || paren < eq)) return [];
  const declarators = s.replace(/\{[^}]*\}/g, '0').split(',');
  const names = [];
  for (const [i, p] of declarators.entries()) {
    const d = p.replace(/=.*$/, '').trim();
    if (i === 0 && /^static\s+const\b[^*]*$/.test(d)) return [];
    const m = /([A-Za-z_]\w*)\s*(\[[^\]]*\]\s*)*$/.exec(d);
    if (m) names.push(m[1]);
  }
  return names;
};

// a line may carry several statements; only column-0 lines can start a file-scope static
const declaredNames = (line) =>
  /^static\s/.test(line) ? line.replace(/\/\/.*$/, '').replace(/struct\s*\{[^}]*\}/g, 'struct_t').split(';').flatMap(statementNames) : [];

const fileScopeStatics = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').flatMap(declaredNames);

const checkWorldStatics = (text, root) => {
  const out = [];
  const kept = macroList(root, 'ck_world_statics.h', 'CK_WSTAT').map(([n]) => n);
  const excluded = new Set(Object.values(EXCLUDED).flatMap((n) => n.split(' ')));
  const found = new Set(fileScopeStatics(text));
  for (const n of found) if (!kept.includes(n) && !excluded.has(n)) out.push(`world.c static ${n} is new: add it to ck_world_statics.h or classify it`);
  for (const n of kept) if (!found.has(n)) out.push(`ck_world_statics.h lists ${n}, no longer a file-scope static of world.c`);
  for (const n of excluded) if (!found.has(n)) out.push(`excluded world.c static ${n} is no longer declared`);
  for (const n of kept) if (excluded.has(n)) out.push(`${n} is both kept and excluded`);
  if (out.length) throw new Error(`overworld section statics out of step with world.c:\n  ${out.join('\n  ')}`);
};

export { checkWorldStatics }
