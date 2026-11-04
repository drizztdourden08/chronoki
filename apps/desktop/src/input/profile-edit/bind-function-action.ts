/* @layer renderer-lib @kind logic */
import type { FunctionMapping } from '@chronoki/input-mapping';
import { bindMapping } from './bind-mapping';
import { NO_BINDING } from './profile-edit.constants';
import { sameGamepadInput } from './same-gamepad-input';
import type { BindFunctionActionParams } from './profile-edit.type';

const bindFunctionAction = ({ mappings, action, binding, vid, pid }: BindFunctionActionParams): FunctionMapping[] =>
  mappings.map((m) => {
    if (m.action === action) return bindMapping({ mapping: m, binding, vid, pid });
    if (sameGamepadInput(m.binding, binding)) return bindMapping({ mapping: m, binding: NO_BINDING, vid: null, pid: null });
    return m;
  });

export { bindFunctionAction };
