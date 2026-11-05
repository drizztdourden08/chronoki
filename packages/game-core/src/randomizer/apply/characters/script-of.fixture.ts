/* @layer bridge-wasm @kind fixture */
import type { CtCharacter } from '../../world/ct-world-keys.type';
import { le16 } from './le16.fixture';
import {
  FUNCTIONS, HEADER, OBJECTS, OP_END, OP_IF_ACTIVE, OP_JOIN, OP_LEAVE, OP_NPC_LOADER,
} from './recruit-rando.fixture.constants';
import { CHARACTER_IDS, FIXED_LOADER_OPS } from './recruit-spot-edits.constants';

const scriptOf = (spot: CtCharacter, holder: CtCharacter): number[] => {
  const own = CHARACTER_IDS[spot];
  const id = CHARACTER_IDS[holder];
  const fixed = FIXED_LOADER_OPS[holder];
  const functions: { object: number; fn: number; ops: number[] }[] = [
    { object: 0, fn: 0, ops: [FIXED_LOADER_OPS[spot], OP_END] },
    { object: 1, fn: 0, ops: [fixed, OP_NPC_LOADER, id, OP_IF_ACTIVE, id, 0, OP_END] },
    { object: 1, fn: 1, ops: [OP_JOIN, id, fixed, OP_LEAVE, own, OP_END] },
    { object: 2, fn: 0, ops: [OP_JOIN, CHARACTER_IDS.crono, OP_END] },
  ];
  const table = new Array<number>(OBJECTS * FUNCTIONS * 2).fill(0);
  const body: number[] = [];
  functions.forEach(({ object, fn, ops }) => {
    table.splice((object * FUNCTIONS + fn) * 2, 2, ...le16(HEADER + body.length));
    body.push(...ops);
  });
  return [OBJECTS, ...table, ...body];
};

export { scriptOf };
