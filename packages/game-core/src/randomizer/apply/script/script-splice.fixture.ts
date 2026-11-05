/* @layer bridge-wasm @kind fixture */
import { readPackEntries } from '../../checks/read-pack-entries';
import { changeLocationTarget } from './change-location-target';
import { isChangeLocation } from './is-change-location';
import type { ScriptSplice } from './script-splice.type';

type Blob = { type: number; id: number; data: number[] };

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];
const POKE = [0x4a, 0x00, 0x00, 0x7e, 0x01];
const CHANGE = [0xe0, 0xf0, 0x01, 0x3f, 0x38];
const RETURN = [0x00];

const buildScript = (bodies: number[][]): number[] => {
  const header = bodies.length * 32;
  const pointers: number[] = [];
  let at = header;
  bodies.forEach((body) => {
    pointers.push(...le16(at), ...new Array<number>(30).fill(0));
    at += body.length;
  });
  return [bodies.length, ...pointers, ...bodies.flat()];
};

const buildPack = (blobs: Blob[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const packOf = (script: number[]): Uint8Array =>
  buildPack([
    { type: 3, id: 0, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0] },
    { type: 16, id: 7, data: script },
    { type: 16, id: 9, data: buildScript([[...POKE, ...RETURN]]) },
    { type: 36, id: 0x400000, data: [...le32(script.length), ...le32(11), ...le32(22), ...script] },
  ]);

const entryBytes = (pack: Uint8Array, type: number, id: number): number[] => {
  const e = readPackEntries(pack).find((x) => x.type === type && x.id === id);
  return e ? [...pack.subarray(e.start, e.start + e.length)] : [];
};

const splice = (replace: number[]): ScriptSplice => ({
  scene: 0,
  anchor: (op) => isChangeLocation(op) && changeLocationTarget(op) === 0x1f0,
  replace: Uint8Array.from(replace),
  why: 'test',
});

const jumpScene = [
  [0x10, 6, ...CHANGE, 0x11, 8, ...RETURN],
  [...POKE, ...RETURN],
  [...RETURN],
];

const spliceFixture = { CHANGE, POKE, RETURN, buildScript, entryBytes, jumpScene, le16, le32, packOf, splice };

export { spliceFixture };
