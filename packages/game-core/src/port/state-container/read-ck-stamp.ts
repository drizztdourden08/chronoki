/* @layer bridge-wasm @kind logic */
import type { CkStamp } from './sectioned-state.type';
import { parsePastLayouts } from './parse-past-layouts';
import { parseSectionIds } from './parse-section-ids';

const stampLines = (text: string): Map<string, string> => {
  const values = new Map<string, string>();
  for (const line of text.split('\n')) {
    const at = line.indexOf('=');
    if (at > 0) values.set(line.slice(0, at), line.slice(at + 1));
  }
  return values;
};

const readCkStamp = (text: string): CkStamp | null => {
  const values = stampLines(text);
  const get = (key: string, fallback = ''): string => values.get(key) ?? fallback;
  const legacy = get('legacy') === '1';
  const schema = get('schema');
  if (!schema && !legacy) return null;
  return {
    pin: get('pin'),
    core: get('core'),
    schema,
    mode: get('mode', 'field'),
    legacy,
    sections: parseSectionIds(get('sections')),
    past: parsePastLayouts(get('past')),
  };
};

export { readCkStamp };
