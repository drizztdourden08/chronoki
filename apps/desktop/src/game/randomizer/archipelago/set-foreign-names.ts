/* @layer bridge-wasm @kind logic */
import type { ApplyContext } from '@drizztdourden08/brock-randomizer/session';
import { apCall, apCallsOrNull } from './chronoki-ap-calls';

const CK_SET_FOREIGN_NAME = 'CkSetForeignName';
const CK_CLEAR_FOREIGN_NAMES = 'CkClearForeignNames';
const KIND_CHEST = 1;
const NAME_MAX = 40;
const CHEST_KEY = /^chest-([0-9a-f]{3})-(\d+)$/;
const NOT_CHARSET = /[^A-Za-z0-9 .,'!?-]/g;

const textOf = (playerName: string, itemName: string): string =>
  `${playerName}'s ${itemName}`.replace(NOT_CHARSET, '').slice(0, NAME_MAX);

const setForeignName = (kind: number, loc: number, key: number, text: string): void => {
  const calls = apCallsOrNull();
  if (calls === null || !calls.has(CK_SET_FOREIGN_NAME)) return;
  const bytes = new TextEncoder().encode(`${text}\0`);
  const ptr = calls.number('malloc', bytes.length);
  if (ptr === 0) return;
  try {
    calls.heap().set(bytes, ptr);
    calls.call(CK_SET_FOREIGN_NAME, kind, loc, key, ptr);
  } finally {
    calls.call('free', ptr);
  }
};

const setForeignNames = (locationKeys: readonly string[], foreign: NonNullable<ApplyContext['foreign']>): void => {
  apCall(CK_CLEAR_FOREIGN_NAMES);
  locationKeys.forEach((key) => {
    const match = CHEST_KEY.exec(key);
    const item = match === null ? undefined : foreign(key);
    if (match === null || item === undefined) return;
    setForeignName(KIND_CHEST, Number.parseInt(match[1] ?? '0', 16), Number(match[2]), textOf(item.playerName, item.itemName));
  });
};

export { setForeignNames };
