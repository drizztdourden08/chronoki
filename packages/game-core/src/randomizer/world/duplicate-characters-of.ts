/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from './ct-world-input.type';

const duplicateCharactersOf = (options: CtOptionValues): boolean =>
  options.characterRando === true && options.duplicateCharacters === true;

export { duplicateCharactersOf };
