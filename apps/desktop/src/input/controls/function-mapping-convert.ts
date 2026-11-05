/* @layer renderer-components @kind logic */
import type { ActionBinding } from '@drizztdourden08/brock-input';
import type { FunctionMapping } from '@chronoki/input-mapping';

const functionToAction = ({ action, ...rest }: FunctionMapping): ActionBinding => ({ ...rest, action });

export { functionToAction };
