/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { PackToken } from '../pack.type';
import type { LexToken } from './lex-token.type';

const TOKEN =
  /(?<ws>\s+)|(?<num>0[xX][0-9A-Fa-f]+[uUlL]*|\d+[uUlL]*)|(?<id>[A-Za-z_]\w*)|(?<str>"(?:[^"\\\n]|\\.)*")|(?<chr>'(?:[^'\\\n]|\\.)+')|(?<op><<|>>|[{}[\]();,=*+\-/%&|^~!?:.<>])/y;

const matchAt = (text: string, at: number): { kind: string; text: string } | null => {
  TOKEN.lastIndex = at;
  const m = TOKEN.exec(text);
  if (m === null) return null;
  const kind = Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0] ?? 'ws';
  return { kind, text: m[0] };
};

const lex = (text: string): PackToken[] => {
  const out: PackToken[] = [];
  let i = 0;
  while (i < text.length) {
    const m = matchAt(text, i);
    if (m === null) throw new PackError(`cannot lex near ${JSON.stringify(text.slice(i, i + 40))}`);
    i += m.text.length;
    if (m.kind !== 'ws') out.push({ kind: m.kind, text: m.text });
  }
  return out;
};

const tokenize = (code: string, header: string): LexToken[] => {
  const out: LexToken[] = [];
  let skipped = '';
  let i = 0;
  while (i < code.length) {
    const m = matchAt(code, i);
    if (m === null) {
      skipped += code[i];
      i += 1;
    } else {
      if (m.kind !== 'ws') out.push({ kind: m.kind, text: m.text, start: i, end: i + m.text.length });
      i += m.text.length;
    }
  }
  if (skipped.trim() !== '') throw new PackError(`${header}: cannot lex ${JSON.stringify(skipped.trim().slice(0, 40))}`);
  return out;
};

export { lex, tokenize };
