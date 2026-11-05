/* @layer bridge-wasm @kind logic */
import { CHARACTER_NAMES, ELEMENT_NAMES, MAGIC_USERS, ROBO_TECH_NAMES } from '../apply/element-rando/element-rando.constants';
import type { ElementAssignment } from '../apply/element-rando/element-rando.type';

const elementRowsOf = (elements: ElementAssignment | undefined): { label: string; value: string }[] => {
  if (elements === undefined) return [];
  return [
    ...MAGIC_USERS.map((user) => ({ label: 'Element', value: `${CHARACTER_NAMES[user]} -> ${ELEMENT_NAMES[elements.characters[user]]}` })),
    ...elements.robo.map((element, i) => ({ label: 'Element', value: `${ROBO_TECH_NAMES[i] ?? 'Robo'} -> ${ELEMENT_NAMES[element]}` })),
  ];
};

export { elementRowsOf };
