/* @layer bridge-wasm @kind logic */
import { findSceneScript } from './find-scene-script';
import { repointScriptEntry } from './repoint-script-entry';
import type { ScriptSplice, SpliceResult } from './script-splice.type';
import { spliceScriptBlob } from './splice-script-blob';

const run = (pack: Uint8Array, splice: ScriptSplice): SpliceResult => {
  const script = findSceneScript(pack, splice.scene);
  if (!script) return { ok: false, failed: [`${splice.why}: scene ${splice.scene} has no script`] };
  const blob = spliceScriptBlob(pack.slice(script.start, script.start + script.length), splice);
  if (!blob.ok) return blob;
  const bytes = repointScriptEntry(pack, script, blob.raw);
  return bytes ? { ok: true, bytes } : { ok: false, failed: [`${splice.why}: script entry not in the pack table`] };
};

const spliceSceneScript = (pack: Uint8Array, splice: ScriptSplice): SpliceResult => {
  try {
    return run(pack, splice);
  } catch (error) {
    return { ok: false, failed: [`${splice.why}: ${error instanceof Error ? error.message : 'splice failed'}`] };
  }
};

export { spliceSceneScript };
