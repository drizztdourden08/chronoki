/* @layer renderer-components @kind logic */
import type { ActionBinding } from '@drizztdourden08/brock-input';
import type { ButtonMapping } from '@chronoki/input-mapping';
import { isSnesButton } from './is-snes-button';

const actionToMapping = ({ action, ...rest }: ActionBinding): ButtonMapping[] =>
  isSnesButton(action) ? [{ ...rest, snesButton: action }] : [];

export { actionToMapping };
