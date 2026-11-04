/* @layer renderer-lib @kind logic */
import type { InputProfile } from '@chronoki/input-mapping';
import { bindMapping } from './bind-mapping';
import type { BindSnesButtonParams } from './profile-edit.type';

const bindSnesButton = ({ profile, button, binding, vid, pid }: BindSnesButtonParams): InputProfile => {
  const firstIndex = profile.mappings.findIndex((m) => m.snesButton === button);
  if (firstIndex < 0) {
    return { ...profile, mappings: [...profile.mappings, bindMapping({ mapping: { snesButton: button, icon: null, binding }, binding, vid, pid })], modifiedAt: Date.now() };
  }
  return {
    ...profile,
    mappings: profile.mappings
      .map((m, index) => (index === firstIndex ? bindMapping({ mapping: m, binding, vid, pid }) : m))
      .filter((m, index) => m.snesButton !== button || index === firstIndex),
    modifiedAt: Date.now(),
  };
};

export { bindSnesButton };
