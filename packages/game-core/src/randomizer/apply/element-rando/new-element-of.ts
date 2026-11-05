/* @layer bridge-wasm @kind logic */
import { combineElements } from './combine-elements';
import { ROBO_VANILLA_ORDER, VANILLA_ELEMENT_OF } from './element-rando.constants';
import type { Element, ElementAssignment, Participant } from './element-rando.type';
import { LASER_SPIN_AT } from './new-element-of.constants';

const vanillaOf = (who: Participant): Element | null => {
  if (who === 'ayla') return null;
  return who === 'robo' ? ROBO_VANILLA_ORDER[LASER_SPIN_AT] ?? null : VANILLA_ELEMENT_OF[who];
};

const rolledOf = (who: Participant, assignment: ElementAssignment): Element | null => {
  if (who === 'ayla') return null;
  return who === 'robo' ? assignment.robo[LASER_SPIN_AT] : assignment.characters[who];
};

const singleOf = (who: Participant, vanilla: Element, assignment: ElementAssignment): Element | null => {
  if (who === 'robo') return assignment.robo[ROBO_VANILLA_ORDER.indexOf(vanilla)] ?? null;
  if (who === 'magus' && vanilla !== 'shadow') return null;
  return rolledOf(who, assignment);
};

const groupOf = (who: readonly Participant[], vanilla: Element, assignment: ElementAssignment): Element | null => {
  const elemental = who.filter((one) => vanillaOf(one) !== null);
  const sources = elemental.filter((one) => vanillaOf(one) === vanilla);
  const rolled = (sources.length > 0 ? sources : elemental).flatMap((one) => rolledOf(one, assignment) ?? []);
  return rolled.length === 0 ? null : combineElements(rolled);
};

const newElementOf = (who: readonly Participant[], vanilla: Element, assignment: ElementAssignment): Element | null => {
  const first = who[0];
  if (first === undefined) return null;
  return who.length === 1 ? singleOf(first, vanilla, assignment) : groupOf(who, vanilla, assignment);
};

export { newElementOf };
