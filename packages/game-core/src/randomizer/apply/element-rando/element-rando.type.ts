/* @layer bridge-wasm @kind type */
type Element = 'lightning' | 'shadow' | 'water' | 'fire';

type ElementCharacter = 'crono' | 'marle' | 'lucca' | 'frog' | 'magus';

type ElementAssignment = {
  characters: Readonly<Record<ElementCharacter, Element>>;
  robo: readonly [Element, Element, Element];
};

type Participant = ElementCharacter | 'robo' | 'ayla';

export type { Element, ElementAssignment, ElementCharacter, Participant };
