/* @layer bridge-wasm @kind fixture */
import type { CtCharacter } from '../../world/ct-world-keys.type';
import { CHARACTER_IDS, FIXED_LOADER_OPS, RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';

type Blob = { type: number; id: number; data: number[] };

const OBJECTS = 3;
const FUNCTIONS = 16;
const HEADER = OBJECTS * 32;
const OP_END = 0x00;
const OP_JOIN = 0xd3;
const OP_LEAVE = 0xd4;
const OP_IF_ACTIVE = 0xd2;
const OP_NPC_LOADER = 0x81;

const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];
const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const scriptOf = (spot: CtCharacter, holder: CtCharacter): number[] => {
  const own = CHARACTER_IDS[spot];
  const id = CHARACTER_IDS[holder];
  const fixed = FIXED_LOADER_OPS[holder];
  const functions: { object: number; fn: number; ops: number[] }[] = [
    { object: 0, fn: 0, ops: [FIXED_LOADER_OPS[spot], OP_END] },
    { object: 1, fn: 0, ops: [fixed, OP_NPC_LOADER, id, OP_IF_ACTIVE, id, 0, OP_END] },
    { object: 1, fn: 1, ops: [OP_JOIN, id, fixed, OP_LEAVE, own, OP_END] },
    { object: 2, fn: 0, ops: [OP_JOIN, CHARACTER_IDS.crono, OP_END] },
  ];
  const table = new Array<number>(OBJECTS * FUNCTIONS * 2).fill(0);
  const body: number[] = [];
  functions.forEach(({ object, fn, ops }) => {
    table.splice((object * FUNCTIONS + fn) * 2, 2, ...le16(HEADER + body.length));
    body.push(...ops);
  });
  return [OBJECTS, ...table, ...body];
};

const sceneBlobs = (scene: number, script: number): Blob[] => [
  { type: 3, id: scene, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(script), 0, 0] },
];

const packOf = (blobs: Blob[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const syntheticRecruitPack = (skipScene?: number): Uint8Array => {
  let script = 0x100;
  const blobs = (Object.entries(RECRUIT_SPOT_SCENES) as [CtCharacter, readonly number[]][]).flatMap(([spot, scenes]) =>
    scenes.filter((scene) => scene !== skipScene).flatMap((scene): Blob[] => {
      script += 1;
      return [...sceneBlobs(scene, script), { type: 16, id: script, data: scriptOf(spot, spot) }];
    }));
  return packOf(blobs);
};

export { scriptOf, syntheticRecruitPack };
