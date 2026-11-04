/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { LexToken } from './lex-token.type';
import { matchAt } from './match-at';

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

export { tokenize };
