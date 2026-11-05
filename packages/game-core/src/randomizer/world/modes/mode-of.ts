/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../ct-world-input.type';
import type { CtModeDef } from './ct-mode-def.type';
import { CT_DEFAULT_MODE, CT_MODES } from './ct-modes.constants';

const modeOf = (options: CtOptionValues = {}): CtModeDef => {
  const id = options.gameMode ?? CT_DEFAULT_MODE;
  const mode = CT_MODES.find((candidate) => candidate.id === id);
  if (mode === undefined) throw new Error(`Unknown game mode "${String(id)}".`);
  if (!mode.implemented) throw new Error(`Game mode "${mode.id}" is not available yet.`);
  return mode;
};

export { modeOf };
