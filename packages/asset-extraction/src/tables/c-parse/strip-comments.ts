/* @layer shared-asset-extraction @kind logic */
const stringEnd = (s: string, i: number, n: number): number => {
  const c = s[i];
  let j = i + 1;
  while (j < n && s[j] !== c) j += s[j] === '\\' ? 2 : 1;
  return j;
};

const stripComments = (s: string): string => {
  const out: string[] = [];
  const n = s.length;
  let i = 0;
  while (i < n) {
    const c = s[i] as string;
    if (c === '"' || c === "'") {
      const j = stringEnd(s, i, n);
      out.push(s.slice(i, j + 1));
      i = j + 1;
    } else if (s.startsWith('//', i)) {
      const j = s.indexOf('\n', i);
      i = j < 0 ? n : j;
    } else if (s.startsWith('/*', i)) {
      const j = s.indexOf('*/', i + 2);
      i = j < 0 ? n : j + 2;
    } else {
      out.push(c);
      i += 1;
    }
  }
  return out.join('');
};

export { stripComments };
