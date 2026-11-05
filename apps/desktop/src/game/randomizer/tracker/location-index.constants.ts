/* @layer bridge-wasm @kind constants */
import type { CtEra } from '@chronoki/game-core';
import { CT_REGIONS } from '@chronoki/game-core';

const ERA_OF_MAP = new Map<number, CtEra>(
  CT_REGIONS.flatMap((spec) => spec.maps.map((map): [number, CtEra] => [map, spec.era])),
);

export { ERA_OF_MAP };
