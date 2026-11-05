/* @layer bridge-wasm @kind constants @source Belthasar battle.c (CC/1BEB control byte +3 = element bits $B190; CC/249F participant groups) */
import type { Element, ElementCharacter, Participant } from './element-rando.type';

const ELEMENT_RANDO_STREAM = ':elements';
const ELEMENT_BYTE_AT = 3;
const GROUP_BYTE_AT = 0;
const GROUP_MASK = 0x7f;
const GROUP_TABLE_ROM = 0x0c249f;
const GROUP_SIZE = 3;
const NO_CHARACTER = 0xff;

const ELEMENT_BITS: Readonly<Record<Element, number>> = { lightning: 0x80, shadow: 0x40, water: 0x20, fire: 0x10 };
const ELEMENT_MASK = 0xf0;
const ELEMENTS: readonly Element[] = ['lightning', 'shadow', 'water', 'fire'];
const ELEMENT_NAMES: Readonly<Record<Element, string>> = { lightning: 'Lightning', shadow: 'Shadow', water: 'Water', fire: 'Fire' };

const CHARACTER_IDS: Readonly<Record<number, Participant>> = {
  0: 'crono', 1: 'marle', 2: 'lucca', 3: 'robo', 4: 'frog', 5: 'ayla', 6: 'magus',
};
const MAGIC_USERS: readonly ElementCharacter[] = ['crono', 'marle', 'lucca', 'frog', 'magus'];
const CHARACTER_NAMES: Readonly<Record<ElementCharacter, string>> = {
  crono: 'Crono', marle: 'Marle', lucca: 'Lucca', frog: 'Frog', magus: 'Magus',
};
const ROBO_TECH_NAMES: readonly string[] = ['Robo (Laser Spin)', 'Robo (Area Bomb)', 'Robo (Shock)'];

const VANILLA_ELEMENT_OF: Readonly<Record<ElementCharacter, Element>> = {
  crono: 'lightning', marle: 'water', lucca: 'fire', frog: 'water', magus: 'shadow',
};
const ROBO_VANILLA_ORDER: readonly Element[] = ['shadow', 'fire', 'lightning'];
const FIRST_ELEMENT_TECH = 1;
const LAST_ELEMENT_TECH = 0x74;

export {
  CHARACTER_IDS, CHARACTER_NAMES, ELEMENT_BITS, ELEMENT_BYTE_AT, ELEMENT_MASK, ELEMENT_NAMES, ELEMENT_RANDO_STREAM, ELEMENTS,
  FIRST_ELEMENT_TECH, GROUP_BYTE_AT, GROUP_MASK, GROUP_SIZE, GROUP_TABLE_ROM, LAST_ELEMENT_TECH, MAGIC_USERS, NO_CHARACTER,
  ROBO_TECH_NAMES, ROBO_VANILLA_ORDER, VANILLA_ELEMENT_OF,
};
