/* @layer bridge-wasm @kind logic */
import type { EditPlan, PackEdit } from '../apply-seed.type';
import { appliedTo } from '../band-rando/applied-to';
import { rebasedEdits } from '../band-rando/rebase-edits';
import { createRomSpace } from '../tech-order/create-rom-space';
import { createRomStage } from '../tech-order/create-rom-stage';
import { CONTROL_TABLE } from '../tech-order/tech-order.constants';
import {
  ELEMENT_BITS, ELEMENT_BYTE_AT, ELEMENT_MASK, ELEMENTS, FIRST_ELEMENT_TECH, GROUP_SIZE, GROUP_TABLE_ROM, LAST_ELEMENT_TECH,
} from './element-rando.constants';
import type { ElementAssignment } from './element-rando.type';
import { newElementOf } from './new-element-of';
import { participantsOf } from './participants-of';

const planElementEdits = (pack: Uint8Array, assignment: ElementAssignment, prior: readonly PackEdit[] = []): EditPlan => {
  const ordered = appliedTo(pack, prior);
  const space = createRomSpace(ordered);
  const stage = createRomStage(ordered, space);
  if (space.read(CONTROL_TABLE.rom + FIRST_ELEMENT_TECH * CONTROL_TABLE.size) === undefined || space.read(GROUP_TABLE_ROM + GROUP_SIZE) === undefined) {
    return { edits: [], failed: ['element-rando: the tech control or participant table is not in the pack'] };
  }
  for (let tech = FIRST_ELEMENT_TECH; tech <= LAST_ELEMENT_TECH; tech += 1) {
    const at = CONTROL_TABLE.rom + tech * CONTROL_TABLE.size + ELEMENT_BYTE_AT;
    const byte = space.read(at) ?? 0;
    const vanilla = ELEMENTS.find((element) => ELEMENT_BITS[element] === (byte & ELEMENT_MASK));
    const who = participantsOf(space, tech);
    if (vanilla === undefined || who === null) continue;
    const next = newElementOf(who, vanilla, assignment);
    if (next !== null && next !== vanilla) {
      stage.put(at, (byte & ~ELEMENT_MASK) | ELEMENT_BITS[next], `element-rando: tech ${tech.toString(16)} ${vanilla} to ${next}`);
    }
  }
  return { edits: rebasedEdits(pack, stage.edits()), failed: [] };
};

export { planElementEdits };
