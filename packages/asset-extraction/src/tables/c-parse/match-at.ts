/* @layer shared-asset-extraction @kind logic */
import { TOKEN } from './lexer.constants';

const matchAt = (text: string, at: number): { kind: string; text: string } | null => {
  TOKEN.lastIndex = at;
  const m = TOKEN.exec(text);
  if (m === null) return null;
  const kind = Object.entries<string | undefined>(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0] ?? 'ws';
  return { kind, text: m[0] };
};

export { matchAt };
