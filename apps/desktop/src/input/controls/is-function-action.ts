/* @layer renderer-components @kind logic */
import { FUNCTION_ACTIONS } from '@chronoki/input-mapping';
import type { FunctionAction } from '@chronoki/input-mapping';

const isFunctionAction = (value: string): value is FunctionAction => FUNCTION_ACTIONS.some((action) => action === value);

export { isFunctionAction };
