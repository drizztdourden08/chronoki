/* @layer bridge-wasm @kind type */
import type { CtRule } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';

type CtRecruit = { region: CtRegionId; rule?: CtRule } | null;

export type { CtRecruit };
