/* @layer bridge-wasm @kind fixture */
import type { CtCharacter } from '../../world/ct-world-keys.type';
import { le32 } from './le32.fixture';
import { HP_GROW_ROM, MP_GROW_ROM, RECORD_BYTES, STAT_RATE_ROM } from './level-record.constants';
import { packOf, sceneBlobs } from './recruit-rando.fixture';
import type { Blob } from './recruit-rando.fixture.type';
import { RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import { scriptOf } from './script-of.fixture';

const NAME = 'ctCharBase';
const NAME_SIZE_AT = 12;
const HP_PAIRS = [10, 2, 40, 3, 70, 4, 99, 5];

const synthRecord = (id: number): number[] => {
  const r = new Array<number>(RECORD_BYTES).fill(0);
  r[0] = id;
  r[1] = id + 1;
  r[0x05] = 100;
  r[0x09] = 10;
  r[0x12] = 1 + id * 3;
  r[0x13] = id + 20;
  r[0x27] = 0x70 + id;
  r[0x2b] = id + 40;
  for (const base of [0x2f, 0x30, 0x32, 0x33, 0x34, 0x35]) r[base] = 5 + id;
  return r;
};

const hpGrowByte = (i: number): number => HP_PAIRS[i % 8] ?? 0;
const mpGrowByte = (i: number): number => (i % 8 === 0 ? 99 : i % 8 === 1 ? 1 : 0);
const rateByte = (i: number): number => (Math.floor(i / 7) + 1) * 10;

const charBaseBlob = (): Blob => {
  const head = new Array<number>(NAME_SIZE_AT + 16).fill(0);
  head[0] = NAME.length;
  [...NAME].forEach((ch, i) => { head[1 + i] = ch.charCodeAt(0); });
  head.splice(NAME_SIZE_AT, 4, ...le32(RECORD_BYTES * 8));
  return { type: 65, id: 0xb0, data: [...head, ...Array.from({ length: 8 }, (_, id) => synthRecord(id)).flat()] };
};

const growthBlobs = (): Blob[] => [
  { type: 37, id: HP_GROW_ROM, data: Array.from({ length: 64 }, (_, i) => hpGrowByte(i)) },
  { type: 37, id: MP_GROW_ROM, data: Array.from({ length: 64 }, (_, i) => mpGrowByte(i)) },
  { type: 37, id: STAT_RATE_ROM, data: Array.from({ length: 56 }, (_, i) => rateByte(i)) },
];

const duplicatePack = (): Uint8Array => {
  let script = 0x100;
  const scenes = (Object.entries(RECRUIT_SPOT_SCENES) as [CtCharacter, readonly number[]][]).flatMap(([spot, list]) =>
    list.flatMap((scene): Blob[] => {
      script += 1;
      return [...sceneBlobs(scene, script), { type: 16, id: script, data: scriptOf(spot, spot) }];
    }));
  return packOf([charBaseBlob(), ...growthBlobs(), ...scenes]);
};

export { duplicatePack, hpGrowByte, mpGrowByte, rateByte, synthRecord };
