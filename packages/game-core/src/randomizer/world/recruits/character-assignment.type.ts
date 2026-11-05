/* @layer bridge-wasm @kind type */
import type { CtCharacter } from '../ct-world-keys.type';

type CharacterAssignment = Readonly<Partial<Record<CtCharacter, CtCharacter>>>;

export type { CharacterAssignment };
