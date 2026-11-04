/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';

const idsInBrackets = (code: string, hs: Headers): string[] => {
  const ids: string[] = [];
  for (const m of code.matchAll(/\[([^\]]*)\]/g)) {
    for (const w of (m[1] as string).match(/[A-Za-z_]\w*/g) ?? []) if (hs.defines.has(w)) ids.push(w);
  }
  return ids;
};

const dimDefines = (hs: Headers): Set<string> => {
  const out = new Set<string>();
  for (const text of hs.texts.values()) {
    const code = text.replace(/^[ \t]*#(?:[^\n]*\\\n)*[^\n]*/gm, '');
    for (const w of idsInBrackets(code, hs)) out.add(w);
  }
  const todo = [...out];
  while (todo.length > 0) {
    for (const tok of hs.defines.get(todo.pop() as string) ?? []) {
      if (tok.kind === 'id' && hs.defines.has(tok.text) && !out.has(tok.text)) {
        out.add(tok.text);
        todo.push(tok.text);
      }
    }
  }
  return out;
};

export { dimDefines };
