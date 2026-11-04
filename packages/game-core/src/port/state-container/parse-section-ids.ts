/* @layer bridge-wasm @kind logic */
import type { SectionIds } from './sectioned-state.type';

const parseSectionIds = (list: string): SectionIds => {
  const ids: Record<string, string> = {};
  for (const entry of list.split(',')) {
    const at = entry.indexOf(':');
    if (at > 0) ids[entry.slice(0, at)] = entry.slice(at + 1);
  }
  return ids;
};

export { parseSectionIds };
