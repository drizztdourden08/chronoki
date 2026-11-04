/* @layer shared-asset-extraction @kind logic */
import type { CScalar } from './c-type.type';

const makeScalar = (kind: string, size: number, signed: boolean): CScalar => ({
  tag: 'scalar',
  kind,
  size,
  align: size,
  signed,
});

export { makeScalar };
