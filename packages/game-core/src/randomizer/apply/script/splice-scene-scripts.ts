/* @layer bridge-wasm @kind logic */
import type { ScriptSplice, SpliceResult } from './script-splice.type';
import { spliceSceneScript } from './splice-scene-script';

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

export { spliceSceneScripts };
