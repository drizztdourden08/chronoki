/* @layer bridge-wasm @kind logic */
import type { SectionIds } from './sectioned-state.type';
import { parseSectionIds } from './parse-section-ids';

const parsePastLayouts = (text: string): Readonly<Record<string, SectionIds>> => {
  const past: Record<string, SectionIds> = {};
  for (const entry of text.split(';')) {
    const at = entry.indexOf('/');
    if (at > 0) past[entry.slice(0, at)] = parseSectionIds(entry.slice(at + 1));
  }
  return past;
};

export { parsePastLayouts };
