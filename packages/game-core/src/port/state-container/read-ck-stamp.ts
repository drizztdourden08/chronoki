/* @layer bridge-wasm @kind logic */
import type { CkStamp } from './sectioned-state.type';

const readCkStamp = (text: string): CkStamp | null => {
  const values = new Map<string, string>();
  for (const line of text.split('\n')) {
    const at = line.indexOf('=');
    if (at > 0) values.set(line.slice(0, at), line.slice(at + 1));
  }
  const legacy = values.get('legacy') === '1';
  const schema = values.get('schema');
  if (!schema && !legacy) return null;
  return {
    pin: values.get('pin') ?? '',
    core: values.get('core') ?? '',
    schema: schema ?? '',
    mode: values.get('mode') ?? 'field',
    legacy,
  };
};

export { readCkStamp };
