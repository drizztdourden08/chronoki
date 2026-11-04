/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { PackToken } from '../pack.type';
import { matchAt } from './match-at';

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

export { lex };
