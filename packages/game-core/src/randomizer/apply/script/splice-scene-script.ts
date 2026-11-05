/* @layer bridge-wasm @kind logic */
import { CTAS_TYPE_SCENE_HEADER, CTAS_TYPE_SCRIPT, SCENE_HEADER_SCRIPT_AT } from '../../checks/gift-ops.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { PackEntry } from '../../checks/read-pack-entries.type';
import { repointScriptEntry } from './repoint-script-entry';
import type { ScriptSplice, SpliceResult } from './script-splice.type';
import { spliceScriptBlob } from './splice-script-blob';

const findSceneScript = (pack: Uint8Array, scene: number): PackEntry | null => {
  const entries = readPackEntries(pack);
  const header = entries.find((e) => e.type === CTAS_TYPE_SCENE_HEADER && e.id === scene);
  if (!header || header.length <= SCENE_HEADER_SCRIPT_AT + 1) return null;
  const at = header.start + SCENE_HEADER_SCRIPT_AT;
  const id = (pack[at] ?? 0) | ((pack[at + 1] ?? 0) << 8);
  return entries.find((e) => e.type === CTAS_TYPE_SCRIPT && e.id === id) ?? null;
};

const spliceSceneScript = (pack: Uint8Array, splice: ScriptSplice): SpliceResult => {
  const script = findSceneScript(pack, splice.scene);
  if (!script) return { ok: false, failed: [`${splice.why}: scene ${splice.scene} has no script`] };
  const blob = spliceScriptBlob(pack.slice(script.start, script.start + script.length), splice);
  if (!blob.ok) return blob;
  const bytes = repointScriptEntry(pack, script, blob.raw);
  return bytes ? { ok: true, bytes } : { ok: false, failed: [`${splice.why}: script entry not in the pack table`] };
};

/** Applies the splices in order; any refusal fails the whole set. The input pack is never changed. */
const spliceSceneScripts = (pack: Uint8Array, splices: readonly ScriptSplice[]): SpliceResult => {
  let bytes = pack;
  const failed: string[] = [];
  splices.forEach((splice) => {
    const result = spliceSceneScript(bytes, splice);
    if (result.ok) bytes = result.bytes;
    else failed.push(...result.failed);
  });
  return failed.length > 0 ? { ok: false, failed } : { ok: true, bytes: bytes === pack ? pack.slice() : bytes };
};

export { spliceSceneScript, spliceSceneScripts };
