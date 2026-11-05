/* @layer bridge-wasm @kind logic */
import { fixScriptJumps } from './fix-script-jumps';
import { listScriptOps } from './script-ops';
import type { BlobResult, ScriptSplice } from './script-splice.type';
import { shiftScriptPointers } from './shift-script-pointers';

const refuse = (why: string, reason: string): BlobResult => ({ ok: false, failed: [`${why}: ${reason}`] });

/** Pure: one script blob (object count, pointer table, body) in, the spliced blob out. The input is never changed. */
const spliceScriptBlob = (raw: Uint8Array, splice: ScriptSplice): BlobResult => {
  const ops = listScriptOps(raw);
  const hits = ops.filter((o) => splice.anchor(raw.slice(1 + o.at, 1 + o.at + o.length)));
  const hit = hits[0];
  if (!hit) return refuse(splice.why, 'anchor not found');
  if (hits.length > 1) return refuse(splice.why, `anchor matches ${hits.length} ops`);
  const shift = { at: hit.at, end: hit.at + hit.length, delta: splice.replace.length - hit.length };
  const next = new Uint8Array(raw.length + shift.delta);
  next.set(raw.subarray(0, 1 + shift.at));
  next.set(splice.replace, 1 + shift.at);
  next.set(raw.subarray(1 + shift.end), 1 + shift.at + splice.replace.length);
  const failed = [...shiftScriptPointers(raw, next, shift), ...fixScriptJumps(raw, next, ops, shift)];
  return failed.length > 0 ? { ok: false, failed: failed.map((f) => `${splice.why}: ${f}`) } : { ok: true, raw: next };
};

export { spliceScriptBlob };
