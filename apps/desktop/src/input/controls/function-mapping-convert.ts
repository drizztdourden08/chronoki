/* @layer renderer-components @kind logic */
import type { ActionBinding } from '@drizztdourden08/brock-input';
import type { FunctionMapping } from '@chronoki/input-mapping';
import { isFunctionAction } from './is-function-action';

const functionToAction = ({ action, ...rest }: FunctionMapping): ActionBinding => ({ ...rest, action });

const actionToFunction = ({ action, ...rest }: ActionBinding): FunctionMapping[] =>
  isFunctionAction(action) ? [{ ...rest, action }] : [];

export { actionToFunction, functionToAction };
