/* @layer bridge-wasm @kind logic */
import { fixScriptJumps } from './fix-script-jumps';
import { listScriptOps } from './list-script-ops';
import { MAX_SCRIPT_LENGTH } from './script-splice.constants';
import type { BlobResult, ScriptSplice } from './script-splice.type';
import { shiftScriptPointers } from './shift-script-pointers';
import { verifyScriptBlob } from './verify-script-blob';

const refuse = (why: string, reasons: string[]): BlobResult => ({ ok: false, failed: reasons.map((r) => `${why}: ${r}`) });

const spliceScriptBlob = (raw: Uint8Array, splice: ScriptSplice): BlobResult => {
  const ops = listScriptOps(raw);
  if (!ops) return refuse(splice.why, ['script does not walk cleanly from function start to function start']);
  const hits = ops.filter((o) => splice.anchor(raw.slice(1 + o.at, 1 + o.at + o.length)));
  const hit = hits[0];
  if (!hit) return refuse(splice.why, ['anchor not found']);
  if (hits.length > 1) return refuse(splice.why, [`anchor matches ${hits.length} ops`]);
  const shift = { at: hit.at, end: hit.at + hit.length, delta: splice.replace.length - hit.length };
  if (raw.length + shift.delta > MAX_SCRIPT_LENGTH) return refuse(splice.why, [`script would exceed ${MAX_SCRIPT_LENGTH} bytes`]);
  const next = new Uint8Array(raw.length + shift.delta);
  next.set(raw.subarray(0, 1 + shift.at));
  next.set(splice.replace, 1 + shift.at);
  next.set(raw.subarray(1 + shift.end), 1 + shift.at + splice.replace.length);
  const failed = [...shiftScriptPointers(raw, next, shift), ...fixScriptJumps(raw, next, ops, shift)];
  if (failed.length > 0) return refuse(splice.why, failed);
  const broken = verifyScriptBlob(next);
  return broken.length > 0 ? refuse(splice.why, broken) : { ok: true, raw: next };
};

export { spliceScriptBlob };
