/* @layer renderer-components @kind logic */
import type { InputProfile as BrockProfile } from '@drizztdourden08/brock-input';
import type { InputProfile } from '@chronoki/input-mapping';
import { actionToMapping } from './action-to-mapping';

const profileFromBrock = ({ verbs: _verbs, slots: _slots, ...profile }: BrockProfile): InputProfile => ({
  ...profile,
  mappings: profile.mappings.flatMap(actionToMapping),
});

export { profileFromBrock };
