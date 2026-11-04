/* @layer bridge-wasm @kind logic */
import type { CkStamp, SectionIds, SectionedState } from './sectioned-state.type';
import { TAG_STAMP } from './ck-state.constants';

const idsOf = (stamp: CkStamp, current: CkStamp): SectionIds | null =>
  Object.keys(stamp.sections).length > 0 ? stamp.sections : current.past[stamp.schema] ?? null;

const changedSections = (state: SectionedState, current: CkStamp): string[] | null => {
  const ids = idsOf(state.stamp, current);
  if (!ids) return null;
  return state.sections
    .map((section) => section.tag.trim())
    .filter((name) => {
      const id = ids[name];
      return name !== TAG_STAMP && (id === undefined || id !== current.sections[name]);
    });
};

export { changedSections };
