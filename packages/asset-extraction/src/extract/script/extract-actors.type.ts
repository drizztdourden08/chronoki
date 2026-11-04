/* @layer shared-asset-extraction @kind types */
import type { Actor } from './script-run.type';

interface SceneActors {
  actors: Actor[];
  scriptIndex: number;
}

export type { SceneActors };
