/* @layer bridge-wasm @kind logic */
import { CTAS_TYPE_SCENE_HEADER, CTAS_TYPE_SCRIPT, SCENE_HEADER_SCRIPT_AT } from '../../checks/gift-ops.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { PackEntry } from '../../checks/read-pack-entries.type';

const findSceneScript = (pack: Uint8Array, scene: number): PackEntry | null => {
  const entries = readPackEntries(pack);
  const header = entries.find((e) => e.type === CTAS_TYPE_SCENE_HEADER && e.id === scene);
  if (!header || header.length <= SCENE_HEADER_SCRIPT_AT + 1) return null;
  const at = header.start + SCENE_HEADER_SCRIPT_AT;
  const id = (pack[at] ?? 0) | ((pack[at + 1] ?? 0) << 8);
  return entries.find((e) => e.type === CTAS_TYPE_SCRIPT && e.id === id) ?? null;
};

export { findSceneScript };
