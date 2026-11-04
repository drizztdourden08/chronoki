/* @layer bridge-wasm @kind logic */
import type { CkStamp, Loadability } from './sectioned-state.type';
import { MESSAGE_NOT_A_STATE, PIN_SHORT, SECTION_LABELS, SECTION_LABEL_UNKNOWN } from './check-loadable.constants';
import { changedSections } from './changed-sections';
import { decodeSectionedState } from './decode-sectioned-state';

const madeBy = (stamp: CkStamp): string =>
  `ChronoKi core ${stamp.core || 'unknown'} (Belthasar ${stamp.pin.slice(0, PIN_SHORT) || 'unknown'})`;

const sectionNames = (names: string[]): string =>
  names.map((name) => `${SECTION_LABELS[name] ?? SECTION_LABEL_UNKNOWN} (${name})`).join(', ');

const refusal = (stamp: CkStamp, changed: string[] | null): Loadability =>
  changed
    ? {
      ok: false,
      stamp,
      reason: 'section-changed',
      message: `This save state was made by ${madeBy(stamp)}. This version keeps its ${sectionNames(changed)} data `
        + 'in a different layout, so it cannot be loaded.',
    }
    : {
      ok: false,
      stamp,
      reason: 'format-mismatch',
      message: `This save state was made by ${madeBy(stamp)}, which used a different save state format.`,
    };

const checkLoadable = (bytes: Uint8Array, current: CkStamp | null): Loadability => {
  const state = decodeSectionedState(bytes);
  if (!state) return { ok: false, stamp: null, reason: 'not-a-state', message: MESSAGE_NOT_A_STATE };
  const { stamp } = state;
  if (stamp.legacy || !current || stamp.schema === current.schema) return { ok: true, stamp };
  const changed = changedSections(state, current);
  return changed?.length === 0 ? { ok: true, stamp } : refusal(stamp, changed);
};

export { checkLoadable };
