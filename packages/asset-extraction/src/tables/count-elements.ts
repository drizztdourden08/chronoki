/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';
import { PackError } from './pack-error';
import type { InitNode } from './pack.type';
import { createInitWriter } from './init-writer';
import { isCharArray } from './is-char-array';
import { isAggregate } from './is-aggregate';

const countElements = (elem: CType, init: InitNode, name: string): number => {
  if (init.kind !== 'list') throw new PackError(`${name}: an open array needs a braced initializer`);
  const dry = createInitWriter({
    tableName: name,
    header: '?',
    buf: new Uint8Array(0),
    relocs: [],
    pool: { add: () => 0, bytes: () => new Uint8Array(0) },
    evalConst: () => 0n,
  });
  const items = init.items;
  let i = 0;
  let n = 0;
  while (i < items.length) {
    const it = items[i] as InitNode;
    const flat = it.kind === 'list' || !isAggregate(elem) || (it.kind === 'str' && isCharArray(elem));
    i = flat ? i + 1 : dry.fill({ t: elem, off: 0, items, from: i, dry: true });
    n += 1;
  }
  return n;
};

export { countElements };
