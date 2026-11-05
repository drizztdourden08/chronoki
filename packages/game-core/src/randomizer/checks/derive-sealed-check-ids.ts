/* @layer bridge-wasm @kind logic */
import { deriveGiftChecks } from './derive-gift-checks';
import { CTAS_TYPE_SCRIPT, OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES } from './gift-ops.constants';
import { measureOpLength } from './measure-op-length';
import { readPackEntries } from './read-pack-entries';
import {
  GIFT_OBJECT_PATTERN, OP_IF_FLAG_BIT, PENDANT_CHARGED_MASK, PENDANT_CHARGED_OFFSET,
} from './sealed-pendant.constants';

const byteAt = (data: Uint8Array, at: number): number => data[at] ?? 0;

const functionStarts = (raw: Uint8Array, header: number, bodyLength: number): { from: number; object: number }[] => {
  const starts = new Map<number, number>();
  for (let k = 0; k < byteAt(raw, 0) * OBJECT_FUNCTIONS; k += 1) {
    const at = (byteAt(raw, 1 + k * 2) | (byteAt(raw, 2 + k * 2) << 8)) - header;
    if (at >= 0 && at < bodyLength && !starts.has(at)) starts.set(at, Math.floor(k / OBJECT_FUNCTIONS));
  }
  return [...starts].map(([from, object]) => ({ from, object })).sort((x, y) => x.from - y.from);
};

const testsChargedPendant = (body: Uint8Array, from: number, to: number): boolean => {
  for (let at = from; at < to; ) {
    const length = measureOpLength(body, at);
    if (length === 0 || at + length > body.length) return false;
    if (
      byteAt(body, at) === OP_IF_FLAG_BIT
      && byteAt(body, at + 1) === PENDANT_CHARGED_OFFSET
      && byteAt(body, at + 2) === PENDANT_CHARGED_MASK
    ) return true;
    at += length;
  }
  return false;
};

const sealedObjectsOf = (raw: Uint8Array): Set<number> => {
  const header = byteAt(raw, 0) * OBJECT_HEADER_BYTES;
  const body = raw.subarray(1 + header);
  const starts = functionStarts(raw, header, body.length);
  const sealed = new Set<number>();
  starts.forEach(({ from, object }, k) => {
    if (testsChargedPendant(body, from, starts[k + 1]?.from ?? body.length)) sealed.add(object);
  });
  return sealed;
};

const deriveSealedCheckIds = (pack: Uint8Array): Set<string> => {
  const scripts = new Map(readPackEntries(pack).filter((entry) => entry.type === CTAS_TYPE_SCRIPT)
    .map((entry) => [entry.id, sealedObjectsOf(pack.subarray(entry.start, entry.start + entry.length))] as const));
  return new Set(deriveGiftChecks(pack).filter((check) => {
    const object = GIFT_OBJECT_PATTERN.exec(check.id)?.[1];
    return check.scriptId !== undefined && object !== undefined && scripts.get(check.scriptId)?.has(Number(object));
  }).map((check) => check.id));
};

export { deriveSealedCheckIds };
