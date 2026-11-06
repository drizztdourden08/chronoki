/* @layer bridge-wasm @kind constants */
import type { CtEventId, CtRegionId } from '../ct-world-keys.type';
import type { CtModeDef } from '../modes/ct-mode-def.type';
import { CT_MODES } from '../modes/ct-modes.constants';

const SHAPE_MODES: readonly CtModeDef[] = CT_MODES.filter((mode) => mode.implemented);

const SHAPE_MENU_REGION: CtRegionId = 'menu';

const SHAPE_GOAL_EVENT: CtEventId = 'ck-goal';

export { SHAPE_GOAL_EVENT, SHAPE_MENU_REGION, SHAPE_MODES };
