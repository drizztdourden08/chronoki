/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { PackToken } from '../pack.type';
import type { DefineMap } from './expr';
import { lex } from './lexer';

interface DefineLog {
  defines: DefineMap;
  /** (header, name) of every #define, in the order the headers met them. */
  order: { header: string; name: string }[];
}

const sameTokens = (a: PackToken[], b: PackToken[]): boolean =>
  a.length === b.length && a.every((t, i) => t.kind === (b[i] as PackToken).kind && t.text === (b[i] as PackToken).text);

const recordDefine = (line: string, header: string, log: DefineLog): boolean => {
  const d = /^#\s*define\s+(\w+)(\(?)\s*(.*)$/.exec(line);
  if (d === null) return false;
  if (d[2] !== '') throw new PackError(`${header}: function-like macro ${d[1] as string}`);
  const name = d[1] as string;
  const toks = lex((d[3] as string).trim());
  const known = log.defines.get(name);
  if (known !== undefined && !sameTokens(known, toks)) throw new PackError(`${header}: #define ${name} differs from another header`);
  if (known === undefined) log.order.push({ header, name });
  log.defines.set(name, toks);
  return true;
};

/**
 * The preprocessor lines (a line starting with #, continued by backslash) are recorded and blanked, so the
 * C tokens keep their offsets. Only #define and the guard/include lines are understood.
 */
const blankDirectives = (text: string, header: string, log: DefineLog): string => {
  const body = text.split('');
  for (const m of text.matchAll(/^[ \t]*#(?:[^\n]*\\\n)*[^\n]*/gm)) {
    const line = m[0].replaceAll('\\\n', ' ').trim();
    for (let k = m.index; k < m.index + m[0].length; k += 1) if (body[k] !== '\n') body[k] = ' ';
    if (!recordDefine(line, header, log) && !/^#\s*(ifndef|endif|include|pragma\s+once)\b/.test(line)) {
      throw new PackError(`${header}: unsupported preprocessor line ${JSON.stringify(line)}`);
    }
  }
  return body.join('');
};

export { blankDirectives };
export type { DefineLog };
