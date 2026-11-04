// Reads the locals field.c's main() declares at its own top level before the main loop: the names host-fields.mjs checks
// against its classification. The text between `int main(...) {` and the loop head is stripped of comments, strings,
// character literals and preprocessor lines, then walked at brace depth 1: a `{` right after `=` is an initialiser and stays
// in the statement, any other `{` opens a nested block (an if, a for, a bare scope) whose declarations are not main's and
// is skipped whole. A statement is a declaration when it starts with a type: specifiers, then a type name followed by a
// name or `*`. Any shape this reader does not know throws, so an upstream change surfaces at build time.
const MAIN_HEAD = 'int main(int argc, char** argv) {\n';
const LOOP_HEAD = '  while (running && !g_shotsExit) {\n';
const SPECIFIERS = new Set(['static', 'const', 'volatile', 'unsigned', 'signed', 'long', 'short', 'register', 'extern']);
const TAGS = new Set(['struct', 'enum', 'union']);
const KEYWORDS = new Set(['if', 'else', 'for', 'while', 'do', 'switch', 'return', 'goto', 'case', 'default', 'break', 'continue', 'sizeof']);

const strip = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\\n]|\\.)+'/g, '0')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/^[ \t]*#[^\n]*$/gm, '');

const preLoopText = (field) => {
  const start = field.indexOf(MAIN_HEAD);
  const end = field.indexOf(LOOP_HEAD, start);
  if (start < 0 || end < 0 || field.indexOf(MAIN_HEAD, start + 1) >= 0) {
    throw new Error('field.c: main() or its loop head moved; update main-locals.mjs');
  }
  return { start, end, text: field.slice(start + MAIN_HEAD.length, end) };
};

const skipBalanced = (s, at) => {
  let depth = 0;
  for (let i = at; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}' && --depth === 0) return i + 1;
  }
  throw new Error('field.c: unbalanced braces before the main loop; update main-locals.mjs');
};

const statements = (s) => {
  const out = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '{') {
      const end = skipBalanced(s, i);
      if (/=\s*$/.test(cur)) cur += s.slice(i, end);
      else cur = '';
      i = end - 1;
    } else if (c === ';') {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
    } else cur += c;
  }
  return out;
};

const splitTop = (s) => {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const c of s) {
    if ('([{'.includes(c)) depth++;
    if (')]}'.includes(c)) depth--;
    if (c === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += c;
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean);
};

const declaration = (stmt) => {
  const toks = [...stmt.matchAll(/\w+|\S/g)];
  let i = 0;
  const lead = [];
  while (i < toks.length && (SPECIFIERS.has(toks[i][0]) || TAGS.has(toks[i][0]))) {
    lead.push(toks[i][0]);
    if (TAGS.has(toks[i][0])) lead.push(toks[++i][0]);
    i++;
  }
  const at = (k) => (toks[k] ? toks[k][0] : '');
  const isName = (k) => /^\w+$/.test(at(k)) && !KEYWORDS.has(at(k));
  let type = '';
  if (isName(i) && (isName(i + 1) || (at(i + 1) === '*' && at(i + 2) !== '='))) type = at(i++);
  else if (!lead.length || !isName(i)) return null;
  const rest = stmt.slice(toks[i].index);
  return splitTop(rest).map((d) => {
    const dm = /^(\**)\s*(\w+)\s*((?:\[[^\]]*\])*)\s*(=[\s\S]*)?$/.exec(d);
    if (!dm) throw new Error(`field.c: main() declares ${JSON.stringify(stmt)}, a shape main-locals.mjs does not read`);
    return { name: dm[2], type: [...lead, type].filter(Boolean).join(' ') + dm[1], dims: dm[3], isStatic: lead.includes('static') };
  });
};

// [{ name, type, dims, isStatic }] in declaration order
const mainLocals = (field) => statements(strip(preLoopText(field).text)).map(declaration).filter(Boolean).flat();

export { LOOP_HEAD, MAIN_HEAD, mainLocals, preLoopText, strip }
