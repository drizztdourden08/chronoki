/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { elementRowsOf } from '../../world/element-rows-of';
import { appliedTo } from '../band-rando/applied-to';
import { applyOptionsOf } from '../enemy-difficulty/apply-options-of';
import { createRomSpace } from '../tech-order/create-rom-space';
import { CONTROL_TABLE } from '../tech-order/tech-order.constants';
import { elementAssignmentOf } from './element-assignment-of';
import { ELEMENT_BITS, ELEMENT_BYTE_AT, ELEMENTS } from './element-rando.constants';
import { syntheticElementPack } from './element-rando.fixture';
import type { ElementAssignment } from './element-rando.type';
import { planElementEdits as plan } from './plan-element-edits';
import { rollElementAssignment } from './roll-element-assignment';

const FIXED: ElementAssignment = {
  characters: { crono: 'fire', marle: 'lightning', lucca: 'water', frog: 'shadow', magus: 'fire' },
  robo: ['water', 'lightning', 'shadow'],
};

const elementOf = (pack: Uint8Array, tech: number): number | undefined =>
  createRomSpace(pack).read(CONTROL_TABLE.rom + tech * CONTROL_TABLE.size + ELEMENT_BYTE_AT);

const expectRolled = (seed: string): void => {
  const rolled = rollElementAssignment(seed);
  const given = Object.values(rolled.characters);
  expect(new Set(given)).toEqual(new Set(ELEMENTS));
  const doubled = ELEMENTS.filter((element) => given.filter((one) => one === element).length === 2);
  expect(doubled).toHaveLength(1);
  expect(new Set(rolled.robo)).toEqual(new Set(ELEMENTS.filter((element) => element !== doubled[0])));
  expect(rollElementAssignment(seed)).toEqual(rolled);
};

describe('element assignment roll', { tags: ['critical'] }, () => {
  it('gives every element to a magic user, doubles one, and is stable per seed', () => {
    ['a', 'b', 'c', 'd', 'e', 'f'].forEach((seed) => expectRolled(seed));
  });

  it('is only rolled when the option is on', () => {
    expect(elementAssignmentOf({}, 's')).toBeUndefined();
    expect(elementAssignmentOf({ elementRando: true }, 's')).toEqual(rollElementAssignment('s'));
    expect(applyOptionsOf({}, [], 's').elementRando).toBeUndefined();
    expect(applyOptionsOf({ elementRando: true }, [], 's').elementRando).toEqual(rollElementAssignment('s'));
  });
});

describe('element edits', { tags: ['critical'] }, () => {
  const pack = syntheticElementPack();
  const edited = appliedTo(pack, plan(pack, FIXED).edits);

  it('plans edits that match the pack', () => {
    const result = plan(pack, FIXED);
    expect(result.failed).toEqual([]);
    result.edits.forEach((e) => expect(pack[e.at]).toBe(e.old));
  });

  it('gives a magic user single techs the rolled element and keeps the low flag bits', () => {
    expect(elementOf(edited, 1)).toBe(ELEMENT_BITS.fire | 0x02);
    expect(elementOf(edited, 2)).toBe(ELEMENT_BITS.lightning | 0x02);
    expect(elementOf(edited, 3)).toBe(ELEMENT_BITS.water | 0x02);
    expect(elementOf(edited, 4)).toBe(ELEMENT_BITS.shadow | 0x02);
  });

  it('keeps Magus spells and moves only his shadow techs', () => {
    expect(elementOf(edited, 5)).toBe(elementOf(pack, 5));
    expect(elementOf(edited, 6)).toBe(ELEMENT_BITS.fire | 0x02);
  });

  it('maps Robo techs by their vanilla element', () => {
    expect(elementOf(edited, 7)).toBe(ELEMENT_BITS.water | 0x02);
    expect(elementOf(edited, 8)).toBe(ELEMENT_BITS.lightning | 0x02);
    expect(elementOf(edited, 9)).toBe(ELEMENT_BITS.shadow | 0x02);
  });

  it('leaves non-elemental techs alone', () => {
    expect(elementOf(edited, 10)).toBe(0x04);
    expect(elementOf(edited, 14)).toBe(0x00);
  });

  it('derives dual techs from the participant that supplied the element', () => {
    expect(elementOf(edited, 11)).toBe(ELEMENT_BITS.lightning | 0x02);
    expect(elementOf(edited, 12)).toBe(ELEMENT_BITS.shadow | 0x02);
    expect(elementOf(edited, 13)).toBe(ELEMENT_BITS.water | 0x02);
  });

  it('changes nothing for the identity assignment and fails without the tables', () => {
    const identity: ElementAssignment = {
      characters: { crono: 'lightning', marle: 'water', lucca: 'fire', frog: 'water', magus: 'shadow' },
      robo: ['shadow', 'fire', 'lightning'],
    };
    expect(plan(pack, identity).edits).toEqual([]);
    expect(plan(syntheticElementPack(false), FIXED).failed).toHaveLength(1);
  });
});

describe('element spoiler rows', { tags: ['critical'] }, () => {
  it('lists each magic user and Robo tech, and nothing when off', () => {
    expect(elementRowsOf(undefined)).toEqual([]);
    const rows = elementRowsOf(FIXED);
    expect(rows).toHaveLength(8);
    expect(rows[0]).toEqual({ label: 'Element', value: 'Crono → Fire' });
    expect(rows[5]).toEqual({ label: 'Element', value: 'Robo (Laser Spin) → Water' });
  });
});
