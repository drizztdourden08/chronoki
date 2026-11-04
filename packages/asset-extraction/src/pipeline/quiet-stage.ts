/* @layer shared-asset-extraction @kind logic */
import type { StageDef } from './stage.type';

const quietStage = (def: StageDef): StageDef => ({ ...def, step: false });

export { quietStage };
