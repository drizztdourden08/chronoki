/* @layer bridge-wasm @kind fixture */
import { le16 } from '../../randomizer/apply/boss-rando/le16.fixture';
import { le32 } from '../../randomizer/apply/boss-rando/le32.fixture';
import { DEATH_PEAK_LOCATIONS, LOCATION_RECORD_BYTES, LOCATION_RECORDS_ROM } from './alt-music.constants';
import type { Blob, MusicPackOptions } from './alt-music.type';

const scriptWith = (object: number, fn: number, ops: number[]): number[] => {
  const count = object + 1;
  const header = count * 32;
  const starts = Array.from({ length: count * 16 }, (_, k) => (k === object * 16 + fn ? header : header + ops.length + 1));
  return [count, ...starts.flatMap((s) => le16(s)), ...ops, 0x00];
};

const bytesOf = (blobs: Blob[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const musicPack = (o: MusicPackOptions = {}): Uint8Array => {
  const scenes: [number, number, number, number[]][] = [
    [0x87, 0x15, 3, o.zenanOps ?? [0xea, 0x29]],
    [0x1ef, 8, 1, o.peakOps ?? [0xea, 0x3c]],
  ];
  const blobs = scenes.flatMap(([scene, object, fn, ops], i): Blob[] => [
    { type: 3, id: scene, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(0x200 + i), 0, 0] },
    { type: 16, id: 0x200 + i, data: scriptWith(object, fn, ops) },
  ]);
  const first = Math.min(...DEATH_PEAK_LOCATIONS);
  const span = (Math.max(...DEATH_PEAK_LOCATIONS) - first + 1) * LOCATION_RECORD_BYTES;
  const table = new Array<number>(span).fill(0x10);
  if (o.firstRecordSong !== undefined) table[0] = o.firstRecordSong;
  blobs.push({ type: 37, id: LOCATION_RECORDS_ROM + first * LOCATION_RECORD_BYTES, data: table });
  return bytesOf(blobs);
};

export { musicPack };
