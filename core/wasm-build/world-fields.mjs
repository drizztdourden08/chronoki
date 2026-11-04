// The overworld section's guard for the World struct (docs/plans/save-state-anywhere-plan.md, phase 2). field.c's `World` holds
// the overworld engine's state; reconnect/ck_world_fields.h lists the members the WRLD section keeps. Every World member must be
// either the `top` of a listed field or named below with its class, and every CtWorldStream member (world.h) except its two
// pointers must be listed under stm, so a member upstream adds, renames or removes fails the build with its name instead of
// being silently left out of (or stale in) a state. The field.c statics in ck_world_fstat.h must still be declared.
// A changed type or size is the compiler's: the table takes sizeof of each designator.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// the World members not in the section, by class
const EXCLUDED = {
  pointer: 'wram vram extSrc',
  derived: `pal have world extOn spr sprN bird birdN boat boatN balloon balloonN objSnap introSnap haveIntroSnap haveBg3 cmath
    haveCmath`,
};
const STREAM_EXCLUDED = 'view ext';

const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');

// the member names of a struct body: statements split at depth-0 ';', commas split declarators, nested {..} dropped
const memberNames = (body) => {
  const names = [];
  let depth = 0;
  let stmt = '';
  const flush = () => {
    for (const p of stmt.split(',').map((s) => s.trim()).filter(Boolean)) {
      const fn = /\(\s*\*\s*([A-Za-z_]\w*)\s*\)/.exec(p);
      const m = /([A-Za-z_]\w*)\s*(\[[^\]]*\]\s*)*$/.exec(p);
      if (fn) names.push(fn[1]);
      else if (m) names.push(m[1]);
    }
    stmt = '';
  };
  for (const ch of body) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (depth === 0 && ch === ';') flush();
    else if (depth === 0) stmt += ch;
  }
  return names;
};

const structBody = (text, closing, file) => {
  const end = text.indexOf(closing);
  if (end < 0) throw new Error(`${file}: "${closing}" not found; the struct moved upstream, update world-fields.mjs`);
  const start = text.lastIndexOf('typedef struct', end);
  const open = text.indexOf('{', start);
  return stripComments(text.slice(open + 1, end));
};

// [[arg, ...]] of every MACRO(arg, ...) in a reconnect/ X-macro list
const macroList = (root, file, macro) => {
  const text = stripComments(readFileSync(join(root, 'core', 'reconnect', file), 'utf8'));
  return [...text.matchAll(new RegExp(`${macro}\\(([^)]*)\\)`, 'g'))].map((m) => m[1].split(',').map((s) => s.trim()));
};

const checkWorldFields = (fieldText, belthasar, root) => {
  const out = [];
  const excluded = new Map(Object.entries(EXCLUDED).flatMap(([c, n]) => n.split(/\s+/).filter(Boolean).map((x) => [x, c])));
  const members = memberNames(structBody(fieldText, '} World;', 'field.c'));
  const listed = macroList(root, 'ck_world_fields.h', 'CK_WORLD');
  const tops = new Set(listed.map(([top]) => top));
  for (const m of members) if (!tops.has(m) && !excluded.has(m)) out.push(`World.${m} is new: add it to ck_world_fields.h or classify it`);
  for (const t of tops) if (!members.includes(t)) out.push(`ck_world_fields.h lists World.${t}, no longer a member`);
  for (const [x, c] of excluded) if (!members.includes(x)) out.push(`excluded World.${x} (${c}) is no longer a member`);
  for (const [top] of listed) if (excluded.has(top)) out.push(`World.${top} is both listed and excluded`);

  const world = readFileSync(join(belthasar, 'src', 'world.h'), 'utf8').replace(/\r\n/g, '\n');
  const stream = memberNames(structBody(world, '} CtWorldStream;', 'world.h'));
  const skip = STREAM_EXCLUDED.split(' ');
  const keptStm = new Set(listed.filter(([top]) => top === 'stm').map(([, path]) => path.replace(/^stm\./, '').replace(/\[.*$/, '')));
  for (const m of stream) if (!keptStm.has(m) && !skip.includes(m)) out.push(`CtWorldStream.${m} is new: add stm.${m} to ck_world_fields.h`);
  for (const k of keptStm) if (!stream.includes(k)) out.push(`ck_world_fields.h lists stm.${k}, no longer a CtWorldStream member`);

  const text = stripComments(fieldText);
  for (const [name] of macroList(root, 'ck_world_fstat.h', 'CK_FSTAT')) {
    if (name === 'owIdle') {
      if (!/static int owIdle = 0;/.test(text)) out.push('owIdle is no longer declared in field.c; update state-patches.mjs');
    } else if (!new RegExp(`(^|;)[ \\t]*static\\b[^;(\\n]*\\b${name}\\b`, 'm').test(text)) {
      out.push(`field.c static ${name} (ck_world_fstat.h) is no longer declared at file scope`);
    }
  }
  if (out.length) throw new Error(`overworld section fields out of step with the engine:\n  ${out.join('\n  ')}`);
};

// the three lists as one text, for the schema hash (state-stamp.mjs)
const worldFieldListText = (root) =>
  [['ck_world_fields.h', 'CK_WORLD'], ['ck_world_fstat.h', 'CK_FSTAT'], ['ck_world_statics.h', 'CK_WSTAT']]
    .map(([f, m]) => macroList(root, f, m).map((a) => a.join('.')).join(',')).join('|');

export { checkWorldFields, worldFieldListText, macroList, memberNames, stripComments }
