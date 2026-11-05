/* @layer renderer-components @kind logic */
import type { ActionBinding, InputProfile as BrockProfile } from '@drizztdourden08/brock-input';
import type { ButtonMapping, InputProfile } from '@chronoki/input-mapping';
import { isSnesButton } from './is-snes-button';

const actionToMapping = ({ action, ...rest }: ActionBinding): ButtonMapping[] =>
  isSnesButton(action) ? [{ ...rest, snesButton: action }] : [];

const profileFromBrock = ({ verbs: _verbs, slots: _slots, ...profile }: BrockProfile): InputProfile => ({
  ...profile,
  mappings: profile.mappings.flatMap(actionToMapping),
});

export { actionToMapping, profileFromBrock };
