/* @layer shared-asset-extraction @kind logic */
import type { CArray, CType } from './c-type.type';

const makeArray = (elem: CType, n: number): CArray => ({
  tag: 'array',
  elem,
  n,
  size: elem.size * n,
  align: elem.align,
});

export { makeArray };
