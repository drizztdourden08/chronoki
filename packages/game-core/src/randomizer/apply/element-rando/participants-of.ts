/* @layer bridge-wasm @kind logic */
import { CONTROL_TABLE } from '../tech-order/tech-order.constants';
import type { RomSpace } from '../tech-order/tech-order.type';
import { CHARACTER_IDS, GROUP_BYTE_AT, GROUP_MASK, GROUP_SIZE, GROUP_TABLE_ROM, NO_CHARACTER } from './element-rando.constants';
import type { Participant } from './element-rando.type';

const participantsOf = (space: RomSpace, tech: number): Participant[] | null => {
  const flags = space.read(CONTROL_TABLE.rom + tech * CONTROL_TABLE.size + GROUP_BYTE_AT);
  if (flags === undefined) return null;
  const found: Participant[] = [];
  for (let k = 0; k < GROUP_SIZE; k += 1) {
    const id = space.read(GROUP_TABLE_ROM + (flags & GROUP_MASK) * GROUP_SIZE + k);
    if (id === undefined) return null;
    const who = id === NO_CHARACTER ? undefined : CHARACTER_IDS[id];
    if (who !== undefined) found.push(who);
  }
  return found;
};

export { participantsOf };
