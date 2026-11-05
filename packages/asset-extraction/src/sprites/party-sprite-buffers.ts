/* @layer shared-asset-extraction @kind logic */
import { readCtas } from '../ctas/read-ctas';
import type { CtasEntry } from '../ctas/ctas.type';
import { T_PORTRAIT, T_SPRITE, T_SPRITEANIM } from '../extract/asset-types.constants';
import { composeSpriteFrame } from './compose-sprite-frame';
import { encodePng } from './encode-png';
import { frameToRgba } from './frame-to-rgba';
import { CT_PARTY_IDS } from './party-sprites.constants';
import type { SpriteBuffer } from './party-sprites.type';
import { portraitRgba } from './portrait-rgba';
import { standingFrameOf } from './standing-frame-of';

const blobOf = (entries: CtasEntry[], type: number, id: number): Uint8Array => {
  const entry = entries.find((e) => e.type === type && e.id === id);
  if (!entry) throw new Error(`pack entry missing: type ${type} id ${id}`);
  return entry.blob;
};

const oneChar = async (entries: CtasEntry[], id: number): Promise<SpriteBuffer[]> => {
  const portrait = portraitRgba(blobOf(entries, T_PORTRAIT, id));
  const sprite = blobOf(entries, T_SPRITE, id);
  const frame = composeSpriteFrame(sprite, standingFrameOf(blobOf(entries, T_SPRITEANIM, id)));
  if (!frame) throw new Error(`sprite ${id}: standing frame does not compose`);
  return [
    { name: `party/portrait-${id}.png`, bytes: await encodePng(portrait) },
    { name: `party/stand-${id}.png`, bytes: await encodePng(frameToRgba(frame)) },
  ];
};

const partySpriteBuffers = async (pack: Uint8Array): Promise<SpriteBuffer[]> => {
  const entries = readCtas(pack);
  return (await Promise.all(CT_PARTY_IDS.map((id) => oneChar(entries, id)))).flat();
};

export { partySpriteBuffers };
