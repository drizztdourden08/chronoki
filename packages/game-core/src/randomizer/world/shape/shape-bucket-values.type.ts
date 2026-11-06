/* @layer bridge-wasm @kind type */
import type { ObjectiveDef } from '../bucket/objective-def.type';

type ShapeBucketValues = { objectives: readonly ObjectiveDef[]; needed: number };

export type { ShapeBucketValues };
