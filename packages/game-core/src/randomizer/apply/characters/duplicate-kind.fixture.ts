/* @layer bridge-wasm @kind fixture */
import type { CtCharacter } from '../../world/ct-world-keys.type';
import { HP_GROW_ROM, MP_GROW_ROM, RECORD_BYTES, STAT_RATE_ROM } from './level-record.constants';
import { NAME, NAME_SIZE_AT } from './duplicate-kind.fixture.constants';
import { hpGrowByte } from './hp-grow-byte.fixture';
import { le32 } from './le32.fixture';
import { mpGrowByte } from './mp-grow-byte.fixture';
import { packOf } from './pack-of.fixture';
import { rateByte } from './rate-byte.fixture';
import type { Blob } from './recruit-rando.fixture.type';
import { RECRUIT_SPOT_SCENES } from './recruit-spot-edits.constants';
import { sceneBlobs } from './scene-blobs.fixture';
import { scriptOf } from './script-of.fixture';
import { synthRecord } from './synth-record.fixture';

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

export { duplicatePack };
