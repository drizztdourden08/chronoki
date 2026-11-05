/* @layer renderer-components @kind logic */
import type { ActionBinding } from '@drizztdourden08/brock-input';
import type { ButtonMapping } from '@chronoki/input-mapping';

const mappingToAction = ({ snesButton, ...rest }: ButtonMapping): ActionBinding => ({ ...rest, action: snesButton });

export { mappingToAction };
