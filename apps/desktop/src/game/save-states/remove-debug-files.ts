/* @layer bridge-wasm @kind logic */
import type { EmscriptenFS } from '@drizztdourden08/brock-port-kit/renderer';
import { DEBUG_FILE_PATTERN } from './state-status.constants';

const rootNames = (fs: EmscriptenFS): string[] => {
  const readdir: unknown = Reflect.get(fs, 'readdir');
  if (typeof readdir !== 'function') return [];
  const names: unknown = Reflect.apply(readdir, fs, ['/']);
  return Array.isArray(names) ? names.filter((name): name is string => typeof name === 'string') : [];
};

const removeDebugFiles = (fs: EmscriptenFS): void => {
  for (const name of rootNames(fs)) {
    if (DEBUG_FILE_PATTERN.test(name)) fs.unlink(`/${name}`);
  }
};

export { removeDebugFiles };
