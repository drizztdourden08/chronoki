/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { CK_EXPORT_TECH_NAME } from '@chronoki/game-core';
import type { GameInfoSnapshot } from '@chronoki/game-core';
import { TECH_FIRST_ID, TECH_PER_CHARACTER } from './game-info.constants';
import type { NameTable } from './game-info.type';
import { nameTableOf } from './name-table-of';

const learnedTechIds = (techs: GameInfoSnapshot['techs']): number[] =>
  techs.single.flatMap((row, character) =>
    row.flatMap((learned, bit) => (learned ? [TECH_FIRST_ID + character * TECH_PER_CHARACTER + bit] : [])));

const readTechNames = (calls: CoreCalls, snapshot: GameInfoSnapshot): NameTable =>
  nameTableOf(calls, CK_EXPORT_TECH_NAME, learnedTechIds(snapshot.techs));

export { readTechNames };
